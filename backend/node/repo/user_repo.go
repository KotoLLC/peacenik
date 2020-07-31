package repo

import (
	"github.com/jmoiron/sqlx"
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
			insert into users(id, name)
			values($1, $2)
			on conflict (id) do update set name = excluded.name where users.name <> excluded.name;`,
		id, name)
	if err != nil {
		return err
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
		return nil, err
	}
	query = r.db.Rebind(query)
	var users []User
	err = r.db.Select(&users, query, args...)
	if err != nil {
		return nil, err
	}
	return users, nil
}
