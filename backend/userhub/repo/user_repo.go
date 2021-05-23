package repo

import (
	"crypto/rand"
	"database/sql"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type User struct {
	ID           string       `json:"id" db:"id"`
	PasswordHash string       `json:"-" db:"password_hash"`
	CreatedAt    time.Time    `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at,omitempty" db:"updated_at"`
	ConfirmedAt  sql.NullTime `json:"confirmed_at,omitempty" db:"confirmed_at"`
}

type UserRepo interface {
	FindUserByIDOrName(value string) *User
	FindUserByID(id string) *User
	FindUsersByEmail(email string) []User
	FindUserByName(name string) *User
	AddUser(id, name, email, fullName, passwordHash string, hideIdentity bool)
	UserCount() int
	SetAvatar(userID, avatarOriginalID, avatarThumbnailID string)
	SetEmail(userID, email string)
	SetFullName(userID, fullName string)
	SetPassword(userID, passwordHash string)
	SetBackground(userID, backgroundID string)
	SetHideIdentity(userID string, hideIdentity bool)
	FindUsers(ids []string) []User
	ConfirmUser(userID string) bool
	BlockUser(userID, blockedUserID string)
	AreBlocked(userID1, userID2 string) bool
	BlockedUserIDs(userID string) []string
	UsersKey(userID1, userID2 string) []byte
	DeleteUser(tx *sqlx.Tx, userID string)
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

type userRepo struct {
	db *sqlx.DB
}

func (r *userRepo) FindUserByIDOrName(value string) *User {
	var user User
	err := r.db.Get(&user, `
		select id, password_hash, created_at, updated_at, confirmed_at
		from users
		where id = $1 or lower(name) = $2`,
		value, strings.ToLower(value))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &user
}

func (r *userRepo) FindUserByID(id string) *User {
	var user User
	err := r.db.Get(&user, `
		select id, password_hash, created_at, updated_at, confirmed_at
		from users
		where id = $1`, id)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &user
}

func (r *userRepo) FindUsersByEmail(email string) []User {
	var users []User
	err := r.db.Select(&users, `
		select id, password_hash, created_at, updated_at, confirmed_at
		from users
		where lower(email) = $1`,
		strings.ToLower(email))
	if err != nil {
		panic(err)
	}
	return users
}

func (r *userRepo) FindUserByName(name string) *User {
	var user User
	err := r.db.Get(&user, `
		select id, password_hash, created_at, updated_at, confirmed_at
		from users
		where lower(name) = $1`,
		strings.ToLower(name))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &user
}

func (r *userRepo) AddUser(id, name, email, fullName, passwordHash string, hideIdentity bool) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
			insert into users(id, name, email, full_name, password_hash, created_at, updated_at, hide_identity)
			values($1, $2, $3, $4, $5, $6, $6, $7);`,
			id, name, email, fullName, passwordHash, common.CurrentTimestamp(), hideIdentity)
		if err != nil {
			return merry.Wrap(err)
		}
		if email != "" {
			_, err = tx.Exec(`
			update invites
			set friend_id = $1
			where friend_id is null and friend_email = $2;`,
				id, email)

			_, err = tx.Exec(`
			update group_invites
			set invited_id = $1
			where invited_id is null and invited_email = $2;`,
				id, email)
		}
		return merry.Wrap(err)
	})
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) UserCount() int {
	var count int
	err := r.db.Get(&count, "select count(*) from users;")
	if err != nil {
		panic(err)
	}
	return count
}

func (r *userRepo) SetAvatar(userID, avatarOriginalID, avatarThumbnailID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var user struct {
			AvatarOriginalID  string `db:"avatar_original_id"`
			AvatarThumbnailID string `db:"avatar_thumbnail_id"`
		}
		err := tx.Get(&user, "select avatar_original_id, avatar_thumbnail_id from users where id = $1", userID)
		if err != nil {
			return merry.Wrap(err)
		}
		now := common.CurrentTimestamp()
		if user.AvatarOriginalID != "" && user.AvatarOriginalID != avatarOriginalID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				user.AvatarOriginalID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}
		if user.AvatarThumbnailID != "" && user.AvatarThumbnailID != avatarThumbnailID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				user.AvatarThumbnailID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}

		_, err = tx.Exec(`
			update users
			set avatar_original_id = $1, avatar_thumbnail_id = $2, updated_at = $3
			where id = $4;`,
			avatarOriginalID, avatarThumbnailID, now, userID)
		return merry.Wrap(err)
	})
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) SetBackground(userID, backgroundID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var currentBackgroundID string
		err := tx.Get(&currentBackgroundID, "select background_id from users where id = $1;", userID)
		if err != nil {
			return merry.Wrap(err)
		}
		now := common.CurrentTimestamp()
		if currentBackgroundID != "" && currentBackgroundID != backgroundID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2);`,
				currentBackgroundID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}

		_, err = tx.Exec(`
			update users
			set background_id = $1, updated_at = $2
			where id = $3;`,
			backgroundID, now, userID)
		return merry.Wrap(err)
	})
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) SetHideIdentity(userID string, hideIdentity bool) {
	_, err := r.db.Exec(`
		update users
		set hide_identity = $1, updated_at = $2
		where id = $3;`,
		hideIdentity, common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) SetEmail(userID, email string) {
	_, err := r.db.Exec(`
		update users
		set email = $1, updated_at = $2
		where id = $3;`,
		email, common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) SetFullName(userID, fullName string) {
	_, err := r.db.Exec(`
		update users
		set full_name = $1, updated_at = $2
		where id = $3;`,
		fullName, common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) SetPassword(userID, passwordHash string) {
	_, err := r.db.Exec(`
		update users
		set password_hash = $1, updated_at = $2
		where id = $3;`,
		passwordHash, common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) FindUsers(ids []string) []User {
	if len(ids) == 0 {
		return nil
	}

	query, args, err := sqlx.In(`
		select id, password_hash, created_at, updated_at, confirmed_at
		from users
		where id in (?)`, ids)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)
	var users []User
	err = r.db.Select(&users, query, args...)
	if err != nil {
		panic(err)
	}
	return users
}

func (r *userRepo) ConfirmUser(userID string) bool {
	res, err := r.db.Exec(`
		update users
		set confirmed_at = $1
		where id = $2 and confirmed_at is null`,
		common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		panic(err)
	}
	return rowsAffected == 1
}

func (r *userRepo) BlockUser(userID, blockedUserID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
			insert into blocked_users(user_id, blocked_user_id, created_at)
			select $1, $2, $3
			where not exists(select * from blocked_users where user_id=$1 and blocked_user_id=$2);`,
			userID, blockedUserID, common.CurrentTimestamp(),
		)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			delete from friends
			where (user_id = $1 and friend_id = $2) or (user_id = $2 and friend_id = $1)`,
			userID, blockedUserID)
		if err != nil {
			return merry.Wrap(err)
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
}

func (r *userRepo) AreBlocked(userID1, userID2 string) bool {
	var exists bool
	err := r.db.Get(&exists, `
		select exists(
		    select *
		    from blocked_users
		    where (user_id = $1 and blocked_user_id = $2) or (user_id = $2 and blocked_user_id = $1))`,
		userID1, userID2)
	if err != nil {
		panic(err)
	}
	return exists
}

func (r *userRepo) BlockedUserIDs(userID string) []string {
	var ids []string
	err := r.db.Select(&ids, `
		select blocked_user_id
		from blocked_users
		where user_id = $1
		union
		select user_id
		from blocked_users
		where blocked_user_id = $1`,
		userID)
	if err != nil {
		panic(err)
	}
	return ids
}

func (r *userRepo) UsersKey(userID1, userID2 string) []byte {
	var key []byte
	err := r.db.Get(&key, `
		select aes_key
		from user_keys
		where (user1_id = $1 and user2_id = $2) or (user1_id = $2 and user2_id = $1);`,
		userID1, userID2)
	if err == nil {
		return key
	}
	if !merry.Is(err, sql.ErrNoRows) {
		panic(err)
	}
	key = make([]byte, 32)
	_, err = rand.Read(key)
	if err != nil {
		panic(err)
	}
	_, err = r.db.Exec(`
		insert into user_keys(id, user1_id, user2_id, aes_key, created_at)
		select $1, $2, $3, $4, $5
		where not exists(select * from user_keys where user1_id = $2 and user2_id = $3)
			and not exists(select * from user_keys where user2_id = $2 and user1_id = $3)`,
		common.GenerateUUID(), userID1, userID2, key, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
	err = r.db.Get(&key, `
		select aes_key
		from user_keys
		where (user1_id = $1 and user2_id = $2) or (user1_id = $2 and user2_id = $1);`,
		userID1, userID2)
	if err != nil {
		panic(err)
	}
	return key
}

func (r *userRepo) DeleteUser(tx *sqlx.Tx, userID string) {
	_, err := tx.Exec(`
		insert into blob_pending_deletes(blob_id, deleted_at)
		select avatar_original_id, $1::timestamptz
		from users
		where id = $2 and avatar_original_id <> ''
		union
		select avatar_thumbnail_id, $1::timestamptz
		from users
		where id = $2 and avatar_thumbnail_id <> ''
		union
		select background_id, $1::timestamptz
		from users
		where id = $2 and background_id <> '';`,
		common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}

	_, err = tx.Exec(`
		update users
		set
		    name = '(deleted)',
		    email = '',
		    password_hash = '',
		    avatar_original_id = '',
		    full_name = '',
		    background_id = '',
		    hide_identity = true
		where id = $1;`,
		userID)
	if err != nil {
		panic(err)
	}
}
