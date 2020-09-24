package repo

import (
	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type User struct {
	ID   string `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type UserRepo interface {
	AddUser(id, name string) error
	FindUsersByName(names []string) ([]User, error)
}

type userRepo struct {
	db *sqlx.DB
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) AddUser(id, name string) error {
	_, err := r.db.Exec(`
			insert into users(id, name, added_at)
			values($1, $2, $3)
			on conflict (id) do update set name = excluded.name where users.name <> excluded.name;`,
		id, name, common.CurrentTimestamp())
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (r *userRepo) FindUsersByName(names []string) ([]User, error) {
	if len(names) == 0 {
		return nil, nil
	}

	query, args, err := sqlx.In(`
		select id, name
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
