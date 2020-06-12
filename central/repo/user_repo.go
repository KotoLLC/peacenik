package repo

import (
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/common"
)

type User struct {
	ID           string `json:"id" db:"id"`
	Name         string `json:"name" db:"name"`
	Email        string `json:"email" db:"email"`
	PasswordHash string `json:"-" db:"password_hash"`
	CreatedAt    string `json:"created_at" db:"created_at"`
	UpdatedAt    string `json:"updated_at" db:"updated_at"`
}

type UserRepo interface {
	FindUserByID(id string) (*User, error)
	FindUserByEmail(email string) (*User, error)
	FindUserByName(name string) (*User, error)
	AddUser(id, name, email, passwordHash string) error
}

type userRepo struct {
	db *sqlx.DB
}

func NewUsers(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (ur *userRepo) FindUserByID(id string) (*User, error) {
	var user User
	err := ur.db.Get(&user, "select id, name, email, password_hash, created_at, updated_at from users where id = $1", id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (ur *userRepo) FindUserByEmail(email string) (*User, error) {
	var user User
	err := ur.db.Get(&user, "select id, name, email, password_hash, created_at, updated_at from users where email = $1", email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (ur *userRepo) FindUserByName(name string) (*User, error) {
	var user User
	err := ur.db.Get(&user, "select id, name, email, password_hash, created_at, updated_at from users where name = $1", name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (ur *userRepo) AddUser(id, name, email, passwordHash string) error {
	_, err := ur.db.Exec("insert into users(id, name, email, password_hash, created_at, updated_at) values($1, $2, $3, $4, $5, $5)",
		id, name, email, passwordHash, common.CurrentTimestamp())
	return err
}
