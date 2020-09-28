package repo

import (
	"database/sql"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type User struct {
	ID        string       `json:"id" db:"id"`
	Name      string       `json:"name" db:"name"`
	BlockedAt sql.NullTime `json:"blocked_at" db:"blocked_at"`
}

type UserRepo interface {
	AddUser(id, name string) (User, error)
	FindUsersByName(names []string) ([]User, error)
	BlockUser(userID string) error
}

type userRepo struct {
	db *sqlx.DB
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) AddUser(id, name string) (User, error) {
	var user User
	err := r.db.Get(&user, `
		select id, name, blocked_at
		from users
		where id = $1`,
		id)
	if err != nil && !merry.Is(err, sql.ErrNoRows) {
		return User{}, merry.Wrap(err)
	}

	if merry.Is(err, sql.ErrNoRows) {
		user = User{
			ID:        id,
			Name:      name,
			BlockedAt: sql.NullTime{},
		}
		_, err := r.db.Exec(`
			insert into users(id, name, added_at)
			values($1, $2, $3)
			on conflict (id) do update set name = excluded.name where users.name <> excluded.name;`,
			id, name, common.CurrentTimestamp())
		if err != nil {
			return User{}, merry.Wrap(err)
		}
	} else if user.Name != name {
		user.Name = name
		_, err := r.db.Exec(`
			update users
			set name = $1    
			where id = $2;`,
			name, id)
		if err != nil {
			return User{}, merry.Wrap(err)
		}
	}
	return user, nil
}

func (r *userRepo) FindUsersByName(names []string) ([]User, error) {
	if len(names) == 0 {
		return nil, nil
	}

	query, args, err := sqlx.In(`
		select id, name, blocked_at
		from users
		where name in (?)`, names)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	query = r.db.Rebind(query)
	var users []User
	err = r.db.Select(&users, query, args...)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return users, nil
}

func (r *userRepo) BlockUser(userID string) error {
	_, err := r.db.Exec(`
		update users
		set blocked_at = $1
		where id = $2 and blocked_at is null;`,
		common.CurrentTimestamp(), userID)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}
