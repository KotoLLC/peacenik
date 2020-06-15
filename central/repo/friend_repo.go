package repo

import (
	"github.com/jmoiron/sqlx"
)

type FriendRepo interface {
	Friends(user User) ([]User, error)
}

type friendRepo struct {
	db *sqlx.DB
}

func NewFriends(db *sqlx.DB) FriendRepo {
	return &friendRepo{
		db: db,
	}
}

func (r *friendRepo) Friends(user User) ([]User, error) {
	var friends []User
	err := r.db.Select(&friends, `
		select id, name
		from users
		where id in (
			select friend_id
			from friends
			where user_id = $1)`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return friends, nil
}
