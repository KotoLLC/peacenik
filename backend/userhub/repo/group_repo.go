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
	AdminName         string    `json:"admin_name" db:"admin_name"`
	AdminFullName     string    `json:"admin_full_name" db:"admin_full_name"`
	AvatarOriginalID  string    `json:"avatar_original_id,omitempty" db:"avatar_original_id"`
	AvatarThumbnailID string    `json:"avatar_thumbnail_id,omitempty" db:"avatar_thumbnail_id"`
	IsPublic          bool      `json:"is_public" db:"is_public"`
	CreatedAt         time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at,omitempty" db:"updated_at"`
	BackgroundID      string    `json:"background_id" db:"background_id"`
}

type GroupInvite struct {
	ID                int          `db:"id"`
	GroupID           string       `db:"group_id"`
	GroupName         string       `db:"group_name"`
	GroupDescription  string       `db:"group_description"`
	GroupIsPublic     bool         `db:"group_is_public"`
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
	RejectedByAdminAt sql.NullTime `db:"rejected_by_admin_at"`
	Message           string       `db:"message"`
}

type GroupRepo interface {
	FindGroupByIDOrName(value string) *Group
	FindGroupByID(id string) *Group
	FindGroupByName(name string) *Group
	AddGroup(id, name, description, adminID string, isPublic bool)
	SetAvatar(groupID, avatarOriginalID, avatarThumbnailID string)
	SetBackground(groupID, backgroundID string)
	SetDescription(groupID, description string)
	SetIsPublic(groupID string, isPublic bool)
	AddUserToGroup(groupID, userID string)
	DeleteGroup(groupID string)
	IsGroupMember(groupID, userID string) bool
	AddInvite(groupID, inviterID, invitedID, message string)
	AddInviteByEmail(groupID, inviterID, invitedEmail, message string)
	AcceptInvite(groupID, inviterID, invitedID string) bool
	RejectInvite(groupID, inviterID, invitedID string) bool
	InvitesFromMe(user User) []GroupInvite
	InvitesForMe(user User) []GroupInvite
	RemoveUserFromGroup(groupID, userID string)
	GroupMembers(groupID string) []User
	ManagedGroups(adminID string) []Group
	ConfirmInvite(groupID, inviterID, invitedID string)
	DenyInvite(groupID, inviterID, invitedID string)
	InvitesToConfirm(adminID string) []GroupInvite
	PublicGroups() []Group
	JoinStatuses(userID string) map[string]string
	UserGroups(userID string) []Group
}

func NewGroups(db *sqlx.DB) GroupRepo {
	return &groupRepo{
		db: db,
	}
}

type groupRepo struct {
	db *sqlx.DB
}

func (r *groupRepo) FindGroupByIDOrName(value string) *Group {
	var group Group
	err := r.db.Get(&group, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where g.id = $1 or lower(g.name) = $2`,
		value, strings.ToLower(value))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &group
}

func (r *groupRepo) FindGroupByID(id string) *Group {
	var group Group
	err := r.db.Get(&group, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where g.id = $1`, id)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &group
}

func (r *groupRepo) FindGroupByName(name string) *Group {
	var group Group
	err := r.db.Get(&group, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where lower(g.name) = $1`,
		strings.ToLower(name))
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &group
}

func (r *groupRepo) AddGroup(id, name, description, adminID string, isPublic bool) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
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
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) SetAvatar(groupID, avatarOriginalID, avatarThumbnailID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
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
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) SetBackground(groupID, backgroundID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var group Group
		err := tx.Get(&group, "select background_id from groups where id = $1", groupID)
		if err != nil {
			return merry.Wrap(err)
		}
		now := common.CurrentTimestamp()
		if group.BackgroundID != "" && group.BackgroundID != backgroundID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				group.BackgroundID, now)
			if err != nil {
				return merry.Wrap(err)
			}
		}

		_, err = tx.Exec(`
			update groups
			set background_id = $1, updated_at = $2
			where id = $3;`,
			backgroundID, now, groupID)
		return merry.Wrap(err)
	})
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) SetDescription(groupID, description string) {
	_, err := r.db.Exec(`
		update groups
		set description = $1, updated_at = $2
		where id = $3;`,
		description, common.CurrentTimestamp(), groupID)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) SetIsPublic(groupID string, isPublic bool) {
	_, err := r.db.Exec(`
		update groups
		set is_public = $1, updated_at = $2
		where id = $3;`,
		isPublic, common.CurrentTimestamp(), groupID)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) AddUserToGroup(groupID, userID string) {
	_, err := r.db.Exec(`
		insert into group_users(group_id, user_id, created_at, updated_at)
		select $1, $2, $3, $3
		where not exists(select * from group_users where group_id = $1 and user_id = $2);`,
		groupID, userID, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) DeleteGroup(groupID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
			delete from group_users
			where group_id = $1;`,
			groupID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			delete from group_invites
			where group_id = $1;`,
			groupID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			delete from groups
			where id = $1;`,
			groupID)
		if err != nil {
			return merry.Wrap(err)
		}

		return nil
	})
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) IsGroupMember(groupID, userID string) bool {
	var isMember bool
	err := r.db.Get(&isMember, `
		select case when exists(select * from group_users where group_id = $1 and user_id = $2) then true else false end`,
		groupID, userID)
	if err != nil {
		panic(err)
	}
	return isMember
}

func (r *groupRepo) AddInvite(groupID, inviterID, invitedID, message string) {
	now := common.CurrentTimestamp()
	acceptedAt := sql.NullTime{}
	if inviterID == invitedID {
		acceptedAt = sql.NullTime{
			Time:  now,
			Valid: true,
		}
	}
	_, err := r.db.Exec(`
		insert into group_invites(group_id, inviter_id, invited_id, created_at, accepted_at, message)
		select $1, $2, $3, $4, $5, $6
		where not exists(select * from group_invites where group_id = $1 and inviter_id = $2 and invited_id = $3 and rejected_at is null)`,
		groupID, inviterID, invitedID, now, acceptedAt, message)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) AddInviteByEmail(groupID, inviterID, invitedEmail, message string) {
	_, err := r.db.Exec(`
		insert into group_invites(group_id, inviter_id, invited_email, created_at, message)
		select $1, $2, $3, $4, $5
		where not exists(select * from group_invites where group_id = $1 and inviter_id = $2 and invited_email = $3 and rejected_at is null);`,
		groupID, inviterID, invitedEmail, common.CurrentTimestamp(), message)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) AcceptInvite(groupID, inviterID, invitedID string) bool {
	now := common.CurrentTimestamp()

	res, err := r.db.Exec(`
		update group_invites
		set accepted_at = $1
		where group_id = $2 and inviter_id = $3 and invited_id = $4 and rejected_at is null`,
		now, groupID, inviterID, invitedID)
	if err != nil {
		panic(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		panic(err)
	}
	if rowsAffected == 0 {
		return false
	}
	return true
}

func (r *groupRepo) RejectInvite(groupID, inviterID, invitedID string) bool {
	res, err := r.db.Exec(`
		update group_invites
		set rejected_at = $1, accepted_at = null, accepted_by_admin_at = null
		where group_id = $2 and inviter_id = $3 and invited_id = $4 and rejected_at is null`,
		common.CurrentTimestamp(), groupID, inviterID, invitedID)
	if err != nil {
		panic(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		panic(err)
	}
	if rowsAffected == 0 {
		return false
	}
	return true
}

func (r *groupRepo) InvitesFromMe(user User) []GroupInvite {
	var invites []GroupInvite
	err := r.db.Select(&invites, `
		select i.id, g.id as group_id, g.name group_name, g.description group_description, g.is_public group_is_public,
		       i.inviter_id, coalesce(u.id, '') as invited_id, coalesce(u.name, '') invited_name, coalesce(u.full_name, '') invited_full_name, coalesce(u.email, i.invited_email) as invited_email,
		       coalesce(u.avatar_thumbnail_id, '') invited_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at, i.accepted_by_admin_at, i.rejected_by_admin_at, i.message
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
		panic(err)
	}
	return invites
}

func (r *groupRepo) InvitesForMe(user User) []GroupInvite {
	var invites []GroupInvite
	err := r.db.Select(&invites, `
		select i.id, g.id as group_id, g.name group_name, g.description group_description, g.is_public group_is_public,
		       i.inviter_id, u.name inviter_name, u.full_name inviter_full_name, u.email inviter_email, u.avatar_thumbnail_id inviter_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at, i.accepted_by_admin_at, i.rejected_by_admin_at, i.message
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
		panic(err)
	}
	return invites
}

func (r *groupRepo) RemoveUserFromGroup(groupID, userID string) {
	_, err := r.db.Exec(`
		delete from group_users
		where group_id = $1 and user_id = $2;`,
		groupID, userID)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) GroupMembers(groupID string) []User {
	var users []User
	err := r.db.Select(&users, `
		select id, name, email, full_name, password_hash, avatar_original_id, avatar_thumbnail_id, created_at, updated_at, confirmed_at
		from users
		where id in (select user_id from group_users where group_id = $1)`,
		groupID)
	if err != nil {
		panic(err)
	}
	return users
}

func (r *groupRepo) ManagedGroups(adminID string) []Group {
	var groups []Group
	err := r.db.Select(&groups, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where g.admin_id = $1
		order by g.name;`,
		adminID)
	if err != nil {
		panic(err)
	}
	return groups
}

func (r *groupRepo) ConfirmInvite(groupID, inviterID, invitedID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		res, err := tx.Exec(`
		update group_invites
		set accepted_by_admin_at = $1
		where group_id = $2 and inviter_id = $3 and invited_id = $4
		  and accepted_by_admin_at is null and rejected_by_admin_at is null and accepted_at is not null and rejected_at is null;`,
			common.CurrentTimestamp(), groupID, inviterID, invitedID,
		)
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
		r.AddUserToGroup(groupID, invitedID)

		var adminID string
		err = tx.Get(&adminID, `select admin_id from groups where id = $1`, groupID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			adminID, invitedID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			insert into friends(user_id, friend_id)
			select $1, $2
			where not exists(select * from friends where user_id = $1 and friend_id = $2)`,
			invitedID, adminID)
		if err != nil {
			return merry.Wrap(err)
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) DenyInvite(groupID, inviterID, invitedID string) {
	_, err := r.db.Exec(`
		update group_invites
		set rejected_by_admin_at = $1
		where group_id = $2 and inviter_id = $3 and invited_id = $4
		  and accepted_by_admin_at is null and rejected_by_admin_at is null and accepted_at is not null and rejected_at is null;`,
		common.CurrentTimestamp(), groupID, inviterID, invitedID,
	)
	if err != nil {
		panic(err)
	}
}

func (r *groupRepo) InvitesToConfirm(adminID string) []GroupInvite {
	var invites []GroupInvite
	err := r.db.Select(&invites, `
		select i.id, g.id as group_id, g.name group_name, g.description group_description, g.is_public group_is_public,
		       i.inviter_id, ur.name inviter_name, ur.full_name inviter_full_name, ur.avatar_thumbnail_id inviter_avatar_id,
		       i.invited_id, ud.name invited_name, ud.full_name invited_full_name, ud.avatar_thumbnail_id inviter_avatar_id,
		       i.created_at, i.accepted_at, i.rejected_at, i.accepted_by_admin_at, i.rejected_by_admin_at, i.message
		from group_invites i
		    inner join groups g on g.id = i.group_id
			inner join users ur on ur.id = i.inviter_id
			inner join users ud on ud.id = i.invited_id
		where g.admin_id = $1 and i.accepted_by_admin_at is null and rejected_by_admin_at is null
		order by g.name, i.created_at desc;`,
		adminID)
	if err != nil {
		panic(err)
	}
	return invites
}

func (r *groupRepo) PublicGroups() []Group {
	var groups []Group
	err := r.db.Select(&groups, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where g.is_public = true
		order by g.name;`)
	if err != nil {
		panic(err)
	}
	return groups
}

func (r *groupRepo) JoinStatuses(userID string) map[string]string {
	var items []struct {
		GroupID string `db:"group_id"`
		Status  string `db:"status"`
	}
	err := r.db.Select(&items, `
		select g.id group_id,
		       case
		           when exists(select * from group_users where group_id = g.id and user_id = $1) then 'member'
		           when exists(select * from group_invites where group_id = g.id and invited_id = $1 and (rejected_at is not null or rejected_by_admin_at is not null)) then 'rejected'
		           when exists(select * from group_invites where group_id = g.id and invited_id = $1) then 'pending'
		           else ''
			   end status
		from groups g
		where g.is_public = true;`,
		userID)
	if err != nil {
		panic(err)
	}
	statuses := make(map[string]string, len(items))
	for _, item := range items {
		statuses[item.GroupID] = item.Status
	}
	return statuses
}

func (r *groupRepo) UserGroups(userID string) []Group {
	var groups []Group
	err := r.db.Select(&groups, `
		select g.id, g.name, g.description, g.admin_id, u.name admin_name, u.full_name admin_full_name,
		       g.avatar_original_id, g.avatar_thumbnail_id, g.is_public, g.created_at, g.updated_at, g.background_id
		from groups g
			inner join users u on u.id = g.admin_id
		where exists(select * from group_users where user_id = $1 and group_id = g.id)
		order by g.name;`,
		userID)
	if err != nil {
		panic(err)
	}
	return groups
}
