package repo

import (
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type User struct {
	ID                string `json:"id" db:"id"`
	Name              string `json:"name" db:"name"`
	Email             string `json:"email,omitempty" db:"email"`
	PasswordHash      string `json:"-" db:"password_hash"`
	AvatarOriginalID  string `json:"avatar_original_id" db:"avatar_original_id"`
	AvatarThumbnailID string `json:"avatar_thumbnail_id" db:"avatar_thumbnail_id"`
	CreatedAt         string `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt         string `json:"updated_at,omitempty" db:"updated_at"`
}

type UserRepo interface {
	FindUser(value string) (*User, error)
	FindUserByID(id string) (*User, error)
	FindUserByEmail(email string) (*User, error)
	FindUserByName(name string) (*User, error)
	FindUserByNameOrEmail(value string) (*User, error)
	AddUser(id, name, email, passwordHash string) error
	UserCount() (int, error)
	SetAvatar(userID, avatarOriginalID, avatarThumbnailID string) error
}

type userRepo struct {
	db *sqlx.DB
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) FindUser(value string) (*User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, email, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at
		from users where id = $1 or name = $1 or email = $1`, value)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) FindUserByID(id string) (*User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, email, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at
		from users
		where id = $1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) FindUserByEmail(email string) (*User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, email, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at
		from users
		where email = $1`, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) FindUserByName(name string) (*User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, email, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at
		from users
		where name = $1`, name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) FindUserByNameOrEmail(value string) (*User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, email, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at
		from users
		where name = $1 or email = $1`, value)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) AddUser(id, name, email, passwordHash string) error {
	_, err := r.db.Exec(`
		insert into users(id, name, email, password_hash, created_at, updated_at)
		values($1, $2, $3, $4, $5, $5)`,
		id, name, email, passwordHash, common.CurrentTimestamp())
	return err
}

func (r *userRepo) UserCount() (int, error) {
	var count int
	err := r.db.Get(&count, "select count(*) from users;")
	return count, err
}

func (r *userRepo) SetAvatar(userID, avatarOriginalID, avatarThumbnailID string) error {
	_, err := r.db.Exec(`
		update users
		set avatar_original_id = $1, avatar_thumbnail_id = $2, updated_at = $3
		where id = $4;`,
		avatarOriginalID, avatarThumbnailID, common.CurrentTimestamp(), userID)
	return err
}
