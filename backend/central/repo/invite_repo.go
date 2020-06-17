package repo

import (
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

var (
	ErrInviteNotFound = errors.New("invite not found")
)

type InviteRepo interface {
	AddInvite(user1ID, user2Email string) error
	AcceptInvite(user1ID, user2ID, user2Email string) error
}

type inviteRepo struct {
	db *sqlx.DB
}

func NewInvites(db *sqlx.DB) InviteRepo {
	return &inviteRepo{
		db: db,
	}
}

func (r *inviteRepo) AddInvite(inviterID, friendEmail string) error {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_email, created_at, accepted_at)
		select $1, $2, $3, ''
		where not exists(select * from invites where user_id = $1 and friend_email = $2)`,
		inviterID, friendEmail, common.CurrentTimestamp())
	return err
}

func (r *inviteRepo) AcceptInvite(inviterID, friendID, friendEmail string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set accepted_at = $1
		where user_id = $2 and friend_email = $3`,
			common.CurrentTimestamp(), inviterID, friendEmail)
		if err != nil {
			return err
		}
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return err
		}
		if rowsAffected == 0 {
			return ErrInviteNotFound
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			inviterID, friendID)
		if err != nil {
			return err
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			friendID, inviterID)
		if err != nil {
			return err
		}

		return nil
	})
}
