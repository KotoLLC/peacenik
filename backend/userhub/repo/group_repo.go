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

type GroupRepo interface {
	FindGroupByIDOrName(value string) (*Group, error)
	FindGroupByID(id string) (*Group, error)
	FindGroupByName(name string) (*Group, error)
	AddGroup(id, name, description, adminID string, isPublic bool) error
	SetAvatar(groupID, avatarOriginalID, avatarThumbnailID string) error
	SetDescription(groupID, description string) error
	SetIsPublic(groupID string, isPublic bool) error
}

type groupRepo struct {
	db *sqlx.DB
}

func NewGroups(db *sqlx.DB) GroupRepo {
	return &groupRepo{
		db: db,
	}
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
		_, err := tx.Exec(`
			insert into groups(id, name, description, admin_id, is_public, created_at, updated_at)
			values($1, $2, $3, $4, $5, $6, $6)`,
			id, name, description, adminID, isPublic, common.CurrentTimestamp())
		if err != nil {
			return merry.Wrap(err)
		}
		return merry.Wrap(err)
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
