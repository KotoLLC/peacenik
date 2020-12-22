package repo

import (
	"database/sql"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Group struct {
	ID                string    `json:"id" db:"id"`
	Name              string    `json:"name" db:"name"`
	Description       string    `json:"description" db:"description"`
	AdminID           string    `json:"admin_id" db:"admin_id"`
	AvatarOriginalID  string    `json:"avatar_original_id,omitempty" db:"avatar_original_id"`
	AvatarThumbnailID string    `json:"avatar_thumbnail_id,omitempty" db:"avatar_thumbnail_id"`
	IsPublic          bool      `json:"is_public" db:"is_public"`
	CreatedAt         time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

type GroupInvite struct {
	ID                int          `db:"id"`
	GroupID           string       `db:"group_id"`
	GroupName         string       `db:"group_name"`
	GroupDescription  string       `db:"group_description"`
	InviterID         string       `db:"inviter_id"`
	InviterName       string       `db:"inviter_name"`
	InviterFullName   string       `db:"inviter_full_name"`
	InviterEmail      string       `db:"inviter_email"`
	InviterAvatarID   string       `db:"inviter_avatar_id"`
	InvitedID         string       `db:"invited_id"`
	InvitedName       string       `db:"invited_name"`
	InvitedFullName   string       `db:"invited_full_name"`
	InvitedEmail      string       `db:"invited_email"`
	InvitedAvatarID   string       `db:"invited_avatar_id"`
	CreatedAt         time.Time    `db:"created_at"`
	AcceptedAt        sql.NullTime `db:"accepted_at"`
	RejectedAt        sql.NullTime `db:"rejected_at"`
	AcceptedByAdminAt sql.NullTime `db:"accepted_by_admin_at"`
}

type GroupRepo interface {
	FindGroupByIDOrName(value string) (*Group, error)
	FindGroupByID(id string) (*Group, error)
	FindGroupByName(name string) (*Group, error)
	AddGroup(id, name, description, adminID string, isPublic bool) error
	SetAvatar(groupID, avatarOriginalID, avatarThumbnailID string) error
	SetDescription(groupID, description string) error
	SetIsPublic(groupID string, isPublic bool) error
	AddUserToGroup(groupID, userID string) error
	DeleteUserFromGroup(groupID, userID string) error
	IsGroupMember(groupID, userID string) (bool, error)
	AddInvite(groupID, inviterID, invitedID string) error
	AddInviteByEmail(groupID, inviterID, invitedEmail string) error
	AcceptInvite(groupID, inviterID, invitedID string) error
	RejectInvite(groupID, inviterID, invitedID string) error
	InvitesFromMe(user User) ([]GroupInvite, error)
	InvitesForMe(user User) ([]GroupInvite, error)
	RemoveUserFromGroup(groupID, userID string) error
	GroupMembers(groupID string) ([]User, error)
}

func NewGroups(db *sqlx.DB) GroupRepo {
	return &groupRepo{
		db: db,
	}
}

type groupRepo struct {
	db *sqlx.DB
}

func (r *groupRepo) FindGroupByIDOrName(value string) (*Group, error) {
	var group Group
	err := r.db.Get(&group, `
		select id, name, description, admin_id, avatar_original_id, avatar_thumbnail_id, is_public, created_at, updated_at
		from groups
		where id = $1 or lower(name) = $2`,
		value, strings.ToLower(value))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, merry.Wrap(err)
	}
	return &group, nil
}

func (r *groupRepo) FindGroupByID(id string) (*Group, error) {
	var group Group
	err := r.db.Get(&group, `
		select id, name, description, admin_id, avatar_original_id, avatar_thumbnail_id, is_public, created_at, updated_at
		from groups
		where id = $1`, id)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, merry.Wrap(err)
	}
	return &group, nil
}

func (r *groupRepo) FindGroupByName(name string) (*Group, error) {
	var group Group
	err := r.db.Get(&group, `
		select id, name, description, admin_id, avatar_original_id, avatar_thumbnail_id, is_public, created_at, updated_at
		from groups
		where lower(name) = $1`,
		strings.ToLower(name))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, merry.Wrap(err)
	}
	return &group, nil
}

func (r *groupRepo) AddGroup(id, name, description, adminID string, isPublic bool) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		now := common.CurrentTimestamp()
		_, err := tx.Exec(`
			insert into groups(id, name, description, admin_id, is_public, created_at, updated_at)
			values($1, $2, $3, $4, $5, $6, $6)`,
			id, name, description, adminID, isPublic, now)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			insert into group_users(group_id, user_id, created_at, updated_at)
			values ($1, $2, $3, $3)`,
			id, adminID, now)
		if err != nil {
			return merry.Wrap(err)
		}

		return nil
	})
}

func (r *groupRepo) SetAvatar(groupID, avatarOriginalID, avatarThumbnailID string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var group Group
		err := tx.Get(&group, "select avatar_original_id, avatar_thumbnail_id from groups where id = $1", groupID)
		if err != nil {
			return merry.Wrap(err)
		}
		now := common.CurrentTimestamp()
		if group.AvatarOriginalID != "" && group.AvatarOriginalID != avatarOriginalID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				group.AvatarOriginalID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}
		if group.AvatarThumbnailID != "" && group.AvatarThumbnailID != avatarThumbnailID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				group.AvatarThumbnailID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}

		_, err = tx.Exec(`
			update groups
			set avatar_original_id = $1, avatar_thumbnail_id = $2, updated_at = $3
			where id = $4;`,
			avatarOriginalID, avatarThumbnailID, now, groupID)
		return merry.Wrap(err)
	})
}

func (r *groupRepo) SetDescription(groupID, description string) error {
	_, err := r.db.Exec(`
		update groups
		set description = $1, updated_at = $2
		where id = $3;`,
		description, common.CurrentTimestamp(), groupID)
	return merry.Wrap(err)
}

func (r *groupRepo) SetIsPublic(groupID string, isPublic bool) error {
	_, err := r.db.Exec(`
		update groups
		set is_public = $1, updated_at = $2
		where id = $3;`,
		isPublic, common.CurrentTimestamp(), groupID)
	return merry.Wrap(err)
}

func (r *groupRepo) AddUserToGroup(groupID, userID string) error {
	_, err := r.db.Exec(`
		insert into group_users(group_id, user_id, created_at, updated_at)
		select $1, $2, $3, $3
		where not exists(select * from group_users where group_id = $1 and user_id = $2);`,
		groupID, userID, common.CurrentTimestamp())
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (r *groupRepo) DeleteUserFromGroup(groupID, userID string) error {
	_, err := r.db.Exec(`
			delete from group_users
			where group_id = $1 and user_id = $2;`,
		groupID, userID)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (r *groupRepo) IsGroupMember(groupID, userID string) (bool, error) {
	var isMember bool
	err := r.db.Get(&isMember, `
		select case when exists(select * from group_users where group_id = $1 and user_id = $2) then true else false end`,
		groupID, userID)
	if err != nil {
		return false, merry.Wrap(err)
	}
	return isMember, nil
}

func (r *groupRepo) AddInvite(groupID, inviterID, invitedID string) error {
	_, err := r.db.Exec(`
		insert into group_invites(group_id, inviter_id, invited_id, created_at)
		select $1, $2, $3, $4
		where not exists(select * from group_invites where group_id = $1 and inviter_id = $2 and invited_id = $3 and rejected_at is null)`,
		groupID, inviterID, invitedID, common.CurrentTimestamp())
	return merry.Wrap(err)
}

func (r *groupRepo) AddInviteByEmail(groupID, inviterID, invitedEmail string) error {
	_, err := r.db.Exec(`
		insert into group_invites(group_id, inviter_id, invited_email, created_at)
		select $1, $2, $3, $4
		where not exists(select * from group_invites where group_id = $1 and inviter_id = $2 and invited_email = $3 and rejected_at is null);`,
		groupID, inviterID, invitedEmail, common.CurrentTimestamp())
	return merry.Wrap(err)
}

func (r *groupRepo) AcceptInvite(groupID, inviterID, invitedID string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var adminID string
		err := tx.Get(&adminID, `select admin_id from groups where id = $1`, groupID)
		if err != nil {
			return merry.Wrap(err)
		}

		now := common.CurrentTimestamp()

		res, err := tx.Exec(`
		update group_invites
		set accepted_at = $1,
		    accepted_by_admin_at = case
		        when inviter_id = $2 then $1
		        else accepted_by_admin_at
		        end
		where group_id = $3 and inviter_id = $4 and invited_id = $5 and rejected_at is null`,
			now, adminID, groupID, inviterID, invitedID)
		if err != nil {
			return merry.Wrap(err)
		}
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return merry.Wrap(err)
		}
		if rowsAffected == 0 {
			return ErrInviteNotFound.Here()
		}

		if adminID == inviterID {
			_, err = tx.Exec(`
			insert into group_users(group_id, user_id, created_at, updated_at) 
			select $1, $2, $3, $3
			where not exists(select * from group_users where group_id = $1 and user_id = $2)`,
				groupID, invitedID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}
		return nil
	})
}

func (r *groupRepo) RejectInvite(groupID, inviterID, invitedID string) error {
	res, err := r.db.Exec(`
		update group_invites
		set rejected_at = $1, accepted_at = null, accepted_by_admin_at = null
		where group_id = $2 and inviter_id = $3 and invited_id = $4 and rejected_at is null`,
		common.CurrentTimestamp(), groupID, inviterID, invitedID)
	if err != nil {
		return merry.Wrap(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return merry.Wrap(err)
	}
	if rowsAffected == 0 {
		return ErrInviteNotFound.Here()
	}
	return nil
}

func (r *groupRepo) InvitesFromMe(user User) ([]GroupInvite, error) {
	var invites []GroupInvite
	err := r.db.Select(&invites, `
		select i.id, g.id as group_id, g.name group_name, g.description group_description,
		       i.inviter_id, coalesce(u.id, '') as invited_id, coalesce(u.name, '') invited_name, coalesce(u.full_name, '') invited_full_name, coalesce(u.email, i.invited_email) as invited_email,
		       coalesce(u.avatar_thumbnail_id, '') invited_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at, i.accepted_by_admin_at
		from group_invites i
		    inner join groups g on g.id = i.group_id
			left join users u on u.id = i.invited_id 
		where i.inviter_id = $1
			and not exists(select * from blocked_users
						   where (user_id = $1 and blocked_user_id = i.invited_id)
						      or (user_id = i.invited_id and blocked_user_id = $1))
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return invites, nil
}

func (r *groupRepo) InvitesForMe(user User) ([]GroupInvite, error) {
	var invites []GroupInvite
	err := r.db.Select(&invites, `
		select i.id, g.id as group_id, g.name group_name, g.description group_description,
		       i.inviter_id, u.name inviter_name, u.full_name inviter_full_name, u.email inviter_email, u.avatar_thumbnail_id inviter_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at, i.accepted_by_admin_at
		from group_invites i
		    inner join groups g on g.id = i.group_id
			inner join users u on u.id = i.inviter_id
		where i.invited_id = $1
			and not exists(select * from blocked_users
						   where (user_id = $1 and blocked_user_id = i.inviter_id)
						      or (user_id = i.inviter_id and blocked_user_id = $1))
		order by i.created_at desc;`,
		user.ID)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return invites, nil
}

func (r *groupRepo) RemoveUserFromGroup(groupID, userID string) error {
	_, err := r.db.Exec(`
		delete from group_users
		where group_id = $1 and user_id = $2;`,
		groupID, userID)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (r *groupRepo) GroupMembers(groupID string) ([]User, error) {
	var users []User
	err := r.db.Select(&users, `
		select id, name, email, full_name, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at, confirmed_at
		from users
		where id in (select user_id from group_users where group_id = $1)`,
		groupID)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return users, nil
}
