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
	FullName  string       `json:"full_name" db:"full_name"`
	BlockedAt sql.NullTime `json:"blocked_at" db:"blocked_at"`
}

func (u User) DisplayName() string {
	if u.FullName == "" || u.FullName == u.Name {
		return u.Name
	}
	return u.FullName + " (" + u.Name + ")"
}

type UserRepo interface {
	AddUser(id, name, fullName string) User
	FindUsersByName(names []string) []User
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

func (r *userRepo) AddUser(id, name, fullName string) User {
	var user User
	err := r.db.Get(&user, `
		select id, name, full_name, blocked_at
		from users
		where id = $1`,
		id)
	if err != nil && !merry.Is(err, sql.ErrNoRows) {
		panic(err)
	}

	if merry.Is(err, sql.ErrNoRows) {
		user = User{
			ID:        id,
			Name:      name,
			FullName:  fullName,
			BlockedAt: sql.NullTime{},
		}
		_, err := r.db.Exec(`
			insert into users(id, name, full_name, added_at)
			values($1, $2, $3, $4)
			on conflict (id) do update
			set name = excluded.name,
				full_name = excluded.full_name
			where users.name <> excluded.name or users.full_name <> excluded.full_name;`,
			id, name, fullName, common.CurrentTimestamp())
		if err != nil {
			panic(err)
		}
	} else if user.Name != name || user.FullName != fullName {
		user.Name = name
		user.FullName = fullName
		_, err := r.db.Exec(`
			update users
			set name = $1,
			    full_name = $2
			where id = $3;`,
			name, fullName, id)
		if err != nil {
			panic(err)
		}
	}
	return user
}

func (r *userRepo) FindUsersByName(names []string) []User {
	if len(names) == 0 {
		return nil
	}

	query, args, err := sqlx.In(`
		select id, name, full_name, blocked_at
		from users
		where name in (?)`, names)
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
