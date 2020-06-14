package repo

import (
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/common"
)

var (
	ErrInviteNotFound = errors.New("invite not found")
)

type InviteRepo interface {
	AddInvite(user1ID, user2Email, community string) error
	AcceptInvite(user1ID, user2ID, user2Email, community string) error
}

type inviteRepo struct {
	db *sqlx.DB
}

func NewInvites(db *sqlx.DB) InviteRepo {
	return &inviteRepo{
		db: db,
	}
}

func (r *inviteRepo) AddInvite(inviterID, friendEmail, community string) error {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_email, community, created_at)
		select $1, $2, $3, $4
		where not exists(select * from invites where user_id = $1 and friend_email = $2 and community = $3)`,
		inviterID, friendEmail, community, common.CurrentTimestamp())
	return err
}

func (r *inviteRepo) AcceptInvite(inviterID, friendID, friendEmail, community string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set accepted_at = $1
		where user_id = $2 and friend_email = $3 and community = $4`,
			common.CurrentTimestamp(), inviterID, friendEmail, community)
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
			insert into relations(user_id, friend_id, community)
			select $1, $2, $3
			where not exists(select * from relations where user_id = $1 and friend_id = $2 and community = $3)`,
			inviterID, friendID, community,
		)
		if err != nil {
			return err
		}

		_, err = tx.Exec(`
			insert into relations(user_id, friend_id, community)
			select $1, $2, $3
			where not exists(select * from relations where user_id = $1 and friend_id = $2 and community = $3)`,
			friendID, inviterID, community,
		)
		if err != nil {
			return err
		}

		return nil
	})
}
