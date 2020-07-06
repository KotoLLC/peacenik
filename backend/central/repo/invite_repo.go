package repo

import (
	"errors"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

var (
	ErrInviteNotFound = errors.New("invite not found")
)

type Invite struct {
	ID          int    `db:"id"`
	UserID      string `db:"user_id"`
	UserName    string `db:"user_name"`
	UserEmail   string `db:"user_email"`
	FriendID    string `db:"friend_id"`
	FriendName  string `db:"friend_name"`
	FriendEmail string `db:"friend_email"`
	CreatedAt   string `db:"created_at"`
	AcceptedAt  string `db:"accepted_at"`
	RejectedAt  string `db:"rejected_at"`
}

type InviteRepo interface {
	AddInvite(userID, friendEmail string) error
	AcceptInvite(inviterID, friendID, friendEmail string) error
	RejectInvite(inviterID, friendID, friendEmail string) error
	InvitesFromMe(user User) ([]Invite, error)
	InvitesForMe(user User) ([]Invite, error)
	InviteStatuses(user User, others []User) (map[string]string, error)
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
		insert into invites(user_id, friend_email, created_at, accepted_at, rejected_at)
		select $1, $2, $3, '', ''
		where not exists(select * from invites where user_id = $1 and friend_email = $2 and rejected_at = '')`,
		inviterID, friendEmail, common.CurrentTimestamp())
	return err
}

func (r *inviteRepo) AcceptInvite(inviterID, friendID, friendEmail string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set accepted_at = $1
		where user_id = $2 and friend_email = $3 and rejected_at = ''`,
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

func (r *inviteRepo) RejectInvite(inviterID, friendID, friendEmail string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set rejected_at = $1, accepted_at = ''
		where user_id = $2 and friend_email = $3 and rejected_at = ''`,
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
			delete from friends
			where (user_id = $1 and friend_id = $2) or (user_id = $2 and friend_id = $1)`,
			inviterID, friendID)
		if err != nil {
			return err
		}

		return nil
	})
}

func (r *inviteRepo) InvitesFromMe(user User) ([]Invite, error) {
	var invites []Invite
	err := r.db.Select(&invites, `
		select i.id, i.user_id, coalesce(u.id, '') friend_id, coalesce(u.name, '') friend_name, i.friend_email,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			left join users u on u.email = i.friend_email 
		where i.user_id = $1
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *inviteRepo) InvitesForMe(user User) ([]Invite, error) {
	var invites []Invite
	err := r.db.Select(&invites, `
		select i.id, i.user_id, u.name user_name, u.email user_email, i.friend_email,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			inner join users u on u.id = i.user_id
		where i.friend_email = $1
		order by i.created_at desc;`,
		user.Email)
	if err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *inviteRepo) InviteStatuses(user User, others []User) (map[string]string, error) {
	if len(others) == 0 {
		return nil, nil
	}

	otherIDs := make([]string, len(others))
	for i, other := range others {
		otherIDs[i] = "'" + other.ID + "'"
	}

	var items []struct {
		UserID string `db:"user_id"`
		Status string `db:"status"`
	}

	err := r.db.Select(&items, fmt.Sprintf(`
with t as (
    select u.id user_id,
           i.accepted_at,
           i.rejected_at,
           row_number() over (partition by i.friend_email order by i.created_at desc) rn
    from invites i
             inner join users u on u.email = i.friend_email
    where i.user_id = '%s'
      and u.id in (%s)
)
select user_id,
       case
           when rejected_at <> '' then 'rejected'
           when accepted_at <> '' then 'accepted'
           else 'pending'
           end status
from t
where rn = 1;
`, user.ID, strings.Join(otherIDs, ",")))
	if err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, item := range items {
		result[item.UserID] = item.Status
	}

	err = r.db.Select(&items, fmt.Sprintf(`
with t as (
    select i.user_id,
           i.accepted_at,
           i.rejected_at,
           row_number() over (partition by i.friend_email order by i.created_at desc) rn
    from invites i
    where i.friend_email = '%s'
      and i.user_id in (%s)
)
select user_id,
       case
           when rejected_at <> '' then 'rejected'
           when accepted_at <> '' then 'accepted'
           else 'pending'
           end status
from t
where rn = 1
`, user.Email, strings.Join(otherIDs, ",")))
	if err != nil {
		return nil, err
	}

	for _, item := range items {
		status, ok := result[item.UserID]
		switch {
		case !ok:
			result[item.UserID] = item.Status
		case status == "pending":
			result[item.UserID] = item.Status
		case status == "accepted" && item.Status == "rejected":
			result[item.UserID] = item.Status
		}
	}

	return result, nil
}
