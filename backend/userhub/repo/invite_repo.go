package repo

import (
	"database/sql"
	"time"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Invite struct {
	ID          int          `db:"id"`
	UserID      string       `db:"user_id"`
	FriendID    string       `db:"friend_id"`
	FriendEmail string       `db:"friend_email"`
	CreatedAt   time.Time    `db:"created_at"`
	AcceptedAt  sql.NullTime `db:"accepted_at"`
	RejectedAt  sql.NullTime `db:"rejected_at"`
}

type InviteRepo interface {
	AddInvite(userID, friendID string)
	AddInviteByEmail(userID, friendEmail string)
	AcceptInvite(inviterID, friendID string, autoAccepted bool) bool
	RejectInvite(inviterID, friendID string) bool
	InvitesFromMe(user User) []Invite
	OpenInvitesForMe(user User) []Invite
	InviteStatuses(user User) map[string]string
	DeleteUserInvites(tx *sqlx.Tx, userID string)
}

func NewInvites(db *sqlx.DB) InviteRepo {
	return &inviteRepo{
		db: db,
	}
}

type inviteRepo struct {
	db *sqlx.DB
}

func (r *inviteRepo) AddInvite(inviterID, friendID string) {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_id, friend_email, created_at)
		select $1, $2, '', $3
		where not exists(select * from invites where user_id = $1 and friend_id = $2 and rejected_at is null)`,
		inviterID, friendID, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
}

func (r *inviteRepo) AddInviteByEmail(inviterID, friendEmail string) {
	_, err := r.db.Exec(`
		insert into invites(user_id, friend_email, created_at)
		select $1, $2, $3
		where not exists(select * from invites where user_id = $1 and friend_email = $2 and rejected_at is null)`,
		inviterID, friendEmail, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
}

func (r *inviteRepo) AcceptInvite(inviterID, friendID string, autoAccepted bool) bool {
	accepted := false
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set accepted_at = $1, auto_accepted = $2
		where user_id = $3 and friend_id = $4 and rejected_at is null`,
			common.CurrentTimestamp(), autoAccepted, inviterID, friendID)
		if err != nil {
			return merry.Wrap(err)
		}
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return merry.Wrap(err)
		}
		if rowsAffected == 0 {
			return nil
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			inviterID, friendID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			friendID, inviterID)
		if err != nil {
			return merry.Wrap(err)
		}

		accepted = true
		return nil
	})
	if err != nil {
		panic(err)
	}
	return accepted
}

func (r *inviteRepo) RejectInvite(inviterID, friendID string) bool {
	rejected := false
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update invites
		set rejected_at = $1, accepted_at = null
		where user_id = $2 and friend_id = $3 and rejected_at is null`,
			common.CurrentTimestamp(), inviterID, friendID)
		if err != nil {
			return merry.Wrap(err)
		}
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return merry.Wrap(err)
		}
		if rowsAffected == 0 {
			return nil
		}

		_, err = tx.Exec(`
			delete from friends
			where (user_id = $1 and friend_id = $2) or (user_id = $2 and friend_id = $1)`,
			inviterID, friendID)
		if err != nil {
			return merry.Wrap(err)
		}

		rejected = true
		return nil
	})
	if err != nil {
		panic(err)
	}
	return rejected
}

func (r *inviteRepo) InvitesFromMe(user User) []Invite {
	var invites []Invite
	err := r.db.Select(&invites, `
		select i.id, i.user_id, coalesce(u.id, '') as friend_id, coalesce(u.email, i.friend_email) as friend_email,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			left join users u on u.id = i.friend_id 
		where i.user_id = $1
			and not exists(select * from blocked_users
						   where (user_id = $1 and blocked_user_id = i.friend_id)
						      or (user_id = i.friend_id and blocked_user_id = $1))
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		panic(err)
	}
	return invites
}

func (r *inviteRepo) OpenInvitesForMe(user User) []Invite {
	var invites []Invite
	err := r.db.Select(&invites, `
		select i.id, i.user_id,
		       i.created_at, i.accepted_at, i.rejected_at
		from invites i
			inner join users u on u.id = i.user_id
		where i.friend_id = $1
		  	and i.accepted_at is null and i.rejected_at is null
			and not exists(select * from blocked_users
						   where (user_id = $1 and blocked_user_id = i.user_id)
						      or (user_id = i.user_id and blocked_user_id = $1))
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		panic(err)
	}
	return invites
}

func (r *inviteRepo) InviteStatuses(user User) map[string]string {
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
		where rn = 1;`,
		user.ID)
	if err != nil {
		panic(err)
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
		where rn = 1;`,
		user.ID)
	if err != nil {
		panic(err)
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

	return result
}

func (r *inviteRepo) DeleteUserInvites(tx *sqlx.Tx, userID string) {
	_, err := tx.Exec(`
		delete from invites
		where user_id = $1 or friend_id = $1;`,
		userID)
	if err != nil {
		panic(err)
	}
}
