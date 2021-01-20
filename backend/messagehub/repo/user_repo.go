package repo

import (
	"database/sql"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type User struct {
	ID        string       `json:"id" db:"id"`
	BlockedAt sql.NullTime `json:"blocked_at" db:"blocked_at"`
}

type UserRepo interface {
	AddUser(id string) User
	BlockUser(userID string)
}

type userRepo struct {
	db *sqlx.DB
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) AddUser(id string) User {
	var user User
	err := r.db.Get(&user, `
		select id, blocked_at
		from users
		where id = $1`,
		id)
	if err != nil && !merry.Is(err, sql.ErrNoRows) {
		panic(err)
	}

	if merry.Is(err, sql.ErrNoRows) {
		user = User{
			ID:        id,
			BlockedAt: sql.NullTime{},
		}
		_, err := r.db.Exec(`
			insert into users(id, added_at)
			values($1, $2)
			on conflict (id) do nothing;`,
			id, common.CurrentTimestamp())
		if err != nil {
			panic(err)
		}
	}
	return user
}

func (r *userRepo) BlockUser(userID string) {
	_, err := r.db.Exec(`
		update users
		set blocked_at = $1
		where id = $2 and blocked_at is null;`,
		common.CurrentTimestamp(), userID)
	if err != nil {
		panic(err)
	}
}
