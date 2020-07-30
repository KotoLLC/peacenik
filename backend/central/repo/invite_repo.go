package repo

import (
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

var (
	ErrInviteNotFound = errors.New("invite not found")
)

type Invite struct {
	ID             int          `db:"id"`
	UserID         string       `db:"user_id"`
	UserName       string       `db:"user_name"`
	UserEmail      string       `db:"user_email"`
	UserAvatarID   string       `db:"user_avatar_id"`
	FriendID       string       `db:"friend_id"`
	FriendName     string       `db:"friend_name"`
	FriendEmail    string       `db:"friend_email"`
	FriendAvatarID string       `db:"friend_avatar_id"`
	CreatedAt      time.Time    `db:"created_at"`
	AcceptedAt     sql.NullTime `db:"accepted_at"`
	RejectedAt     sql.NullTime `db:"rejected_at"`
}

type InviteRepo interface {
	AddInvite(userID, friendID string) error
	AddInviteByEmail(userID, friendEmail string) error
	AcceptInvite(inviterID, friendID string) error
	RejectInvite(inviterID, friendID string) error
	InvitesFromMe(user User) ([]Invite, error)
	InvitesForMe(user User) ([]Invite, error)
	InviteStatuses(user User) (map[string]string, error)
}

type inviteRepo struct {
	db *sqlx.DB
}

func NewInvites(db *sqlx.DB) InviteRepo {
	return &inviteRepo{
		db: db,
	}
}

func (r *inviteRepo) AddInvite(inviterID, friendID string) error {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_id, friend_email, created_at)
		select $1, $2, '', $3
		where not exists(select * from invites where user_id = $1 and friend_id = $2 and rejected_at is null)`,
		inviterID, friendID, common.CurrentTimestamp())
	return err
}

func (r *inviteRepo) AddInviteByEmail(inviterID, friendEmail string) error {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_email, created_at)
		select $1, $2, $3
		where not exists(select * from invites where user_id = $1 and friend_email = $2 and rejected_at is null)`,
		inviterID, friendEmail, common.CurrentTimestamp())
	return err
}

func (r *inviteRepo) AcceptInvite(inviterID, friendID string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set accepted_at = $1
		where user_id = $2 and friend_id = $3 and rejected_at is null`,
			common.CurrentTimestamp(), inviterID, friendID)
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

func (r *inviteRepo) RejectInvite(inviterID, friendID string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set rejected_at = $1, accepted_at = null
		where user_id = $2 and friend_id = $3 and rejected_at is null`,
			common.CurrentTimestamp(), inviterID, friendID)
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
		select i.id, i.user_id, coalesce(u.id, '') friend_id, coalesce(u.name, '') friend_name, coalesce(u.email, i.friend_email) friend_email,
		       coalesce(u.avatar_thumbnail_id, '') friend_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			left join users u on u.id = i.friend_id 
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
		select i.id, i.user_id, u.name user_name, u.email user_email, u.avatar_thumbnail_id user_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			inner join users u on u.id = i.user_id
		where i.friend_id = $1
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return invites, nil
}

func (r *inviteRepo) InviteStatuses(user User) (map[string]string, error) {
	var items []struct {
		UserID string `db:"user_id"`
		Status string `db:"status"`
	}

	err := r.db.Select(&items, `
with t as (
    select u.id user_id,
           i.accepted_at,
           i.rejected_at,
           row_number() over (partition by i.friend_id order by i.created_at desc) rn
    from invites i
             inner join users u on u.id = i.friend_id
    where i.user_id = $1
)
select user_id,
       case
           when rejected_at is not null then 'rejected'
           when accepted_at is not null then 'accepted'
           else 'pending'
           end status
from t
where rn = 1;
`, user.ID)
	if err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, item := range items {
		result[item.UserID] = item.Status
	}

	err = r.db.Select(&items, `
with t as (
    select i.user_id,
           i.accepted_at,
           i.rejected_at,
           row_number() over (partition by i.friend_id order by i.created_at desc) rn
    from invites i
    where i.friend_id = $1
)
select user_id,
       case
           when rejected_at is not null then 'rejected'
           when accepted_at is not null then 'accepted'
           else 'pending'
           end status
from t
where rn = 1
`, user.ID)
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
