package repo

import (
	"github.com/jmoiron/sqlx"
)

type FriendRepo interface {
	Friends(user User) (map[User][]User, error)
	FriendsOfFriends(user User) (map[User][]User, error)
}

type friendRepo struct {
	db *sqlx.DB
}

func NewFriends(db *sqlx.DB) FriendRepo {
	return &friendRepo{
		db: db,
	}
}

func (r *friendRepo) Friends(user User) (map[User][]User, error) {
	result := make(map[User][]User)

	var items []struct {
		UserID         string `db:"user_id"`
		UserName       string `db:"user_name"`
		UserAvatarID   string `db:"user_avatar_id"`
		FriendID       string `db:"friend_id"`
		FriendName     string `db:"friend_name"`
		FriendAvatarID string `db:"friend_avatar_id"`
	}
	err := r.db.Select(&items, `
		select f.user_id user_id, uu.name user_name, uu.avatar_thumbnail_id user_avatar_id,
			f.friend_id friend_id, uf.name friend_name, uf.avatar_thumbnail_id friend_avatar_id
		from friends f
        	inner join users uu on uu.id = f.user_id
        	inner join users uf on uf.id = f.friend_id
		where f.user_id in (select friend_id from friends where user_id = $1)`,
		user.ID)
	if err != nil {
		return nil, err
	}

	for _, item := range items {
		user := User{ID: item.UserID, Name: item.UserName, AvatarThumbnailID: item.UserAvatarID}
		result[user] = append(result[user], User{ID: item.FriendID, Name: item.FriendName, AvatarThumbnailID: item.FriendAvatarID})
	}

	return result, nil
}

func (r *friendRepo) FriendsOfFriends(user User) (map[User][]User, error) {
	result := make(map[User][]User)

	var items []struct {
		UserID         string `db:"user_id"`
		UserName       string `db:"user_name"`
		UserAvatarID   string `db:"user_avatar_id"`
		FriendID       string `db:"friend_id"`
		FriendName     string `db:"friend_name"`
		FriendAvatarID string `db:"friend_avatar_id"`
	}
	err := r.db.Select(&items, `
		select f.friend_id user_id, uf.name user_name, uf.avatar_thumbnail_id user_avatar_id,
		       f.user_id friend_id, uu.name friend_name, uu.avatar_thumbnail_id friend_avatar_id 
		from friends f
			inner join users uu on uu.id = f.user_id
			inner join users uf on uf.id = f.friend_id
		where f.user_id in (select friend_id from friends where user_id = $1)
			and f.friend_id not in (select friend_id from friends where user_id = $1)
			and f.friend_id <> $1`,
		user.ID)
	if err != nil {
		return nil, err
	}

	for _, item := range items {
		user := User{ID: item.UserID, Name: item.UserName, AvatarThumbnailID: item.UserAvatarID}
		result[user] = append(result[user], User{ID: item.FriendID, Name: item.FriendName, AvatarThumbnailID: item.FriendAvatarID})
	}

	return result, nil
}
