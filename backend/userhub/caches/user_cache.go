package caches

import (
	"database/sql"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"
)

type User struct {
	Name              string `db:"name"`
	FullName          string `db:"full_name"`
	Email             string `db:"email"`
	AvatarOriginalID  string `db:"avatar_original_id"`
	AvatarThumbnailID string `db:"avatar_thumbnail_id"`
	BackgroundID      string `db:"background_id"`
	HideIdentity      bool   `db:"hide_identity"`
	DisplayName       string
}

type Users interface {
	User(userID, meID string) User
	UserFullAccess(userID string) User
}

func NewUsers(db *sqlx.DB) Users {
	return &userCache{
		db: db,
	}
}

type userCache struct {
	db *sqlx.DB
}

func (c *userCache) User(userID, meID string) User {
	var user User
	err := c.db.Get(&user, `
		select name, full_name, email, avatar_original_id, avatar_thumbnail_id, background_id, hide_identity
		from users
		where id = $1;`,
		userID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return User{}
		}
		panic(err)
	}

	if user.FullName == "" || user.FullName == user.Name {
		user.DisplayName = user.Name
	} else {
		user.DisplayName = user.FullName + " (" + user.Name + ")"
	}

	if userID == meID {
		return user
	}

	if !user.HideIdentity {
		if meID != "" {
			return user
		}

		var hasPublicMessages bool
		err := c.db.Get(&hasPublicMessages, `
			select exists(
			    select *
			    from user_message_hubs
				where user_id = $1 and public_at is not null);`,
			userID)
		if err != nil {
			panic(err)
		}

		if hasPublicMessages {
			return user
		}
	}

	var isFriend bool
	if meID != "" {
		err = c.db.Get(&isFriend, `
		select exists(select * from friends where user_id = $1 and friend_id = $2);`,
			userID, meID)
		if err != nil {
			panic(err)
		}
	}

	if !isFriend {
		user.Name = "Anonymous"
		user.FullName = "Anonymous"
		user.DisplayName = "Anonymous"
		user.Email = ""
		user.AvatarOriginalID = ""
		user.AvatarThumbnailID = ""
		user.BackgroundID = ""
	}

	return user
}

func (c *userCache) UserFullAccess(userID string) User {
	return c.User(userID, userID)
}
