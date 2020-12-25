package repo

import (
	"github.com/jmoiron/sqlx"
)

type FriendRepo interface {
	Friends(user User) []User
	FriendsWithSubFriends(user User) map[User][]User
	FriendsOfFriends(user User) map[User][]User
	AreFriends(userID1, userID2 string) bool
}

type friendRepo struct {
	db *sqlx.DB
}

func NewFriends(db *sqlx.DB) FriendRepo {
	return &friendRepo{
		db: db,
	}
}

func (r *friendRepo) Friends(user User) []User {
	var friends []User
	err := r.db.Select(&friends, `
		select id, name, full_name, avatar_thumbnail_id
		from users
		where id in (
			select friend_id
			from friends
			where user_id = $1)`,
		user.ID)
	if err != nil {
		panic(err)
	}
	return friends
}

func (r *friendRepo) FriendsWithSubFriends(user User) map[User][]User {
	result := make(map[User][]User)

	var items []struct {
		UserID         string `db:"user_id"`
		UserName       string `db:"user_name"`
		UserFullName   string `db:"user_full_name"`
		UserAvatarID   string `db:"user_avatar_id"`
		FriendID       string `db:"friend_id"`
		FriendName     string `db:"friend_name"`
		FriendFullName string `db:"friend_full_name"`
		FriendAvatarID string `db:"friend_avatar_id"`
	}
	err := r.db.Select(&items, `
		select f.user_id as user_id, uu.name user_name, uu.full_name user_full_name, uu.avatar_thumbnail_id user_avatar_id,
			f.friend_id as friend_id, uf.name friend_name, uf.full_name friend_full_name, uf.avatar_thumbnail_id friend_avatar_id
		from friends f
        	inner join users uu on uu.id = f.user_id
        	inner join users uf on uf.id = f.friend_id
		where f.user_id in (select friend_id from friends where user_id = $1)
			and not exists(
		  	    select *
		  	    from blocked_users bu
		  		where (bu.user_id = $1 and bu.blocked_user_id = f.friend_id)
		  		   or (bu.user_id = f.friend_id and bu.blocked_user_id = $1)) 
`,
		user.ID)
	if err != nil {
		panic(err)
	}

	for _, item := range items {
		user := User{
			ID:                item.UserID,
			Name:              item.UserName,
			FullName:          item.UserFullName,
			AvatarThumbnailID: item.UserAvatarID,
		}
		result[user] = append(result[user], User{
			ID:                item.FriendID,
			Name:              item.FriendName,
			FullName:          item.FriendFullName,
			AvatarThumbnailID: item.FriendAvatarID,
		})
	}

	return result
}

func (r *friendRepo) FriendsOfFriends(user User) map[User][]User {
	result := make(map[User][]User)

	var items []struct {
		UserID         string `db:"user_id"`
		UserName       string `db:"user_name"`
		UserFullName   string `db:"user_full_name"`
		UserAvatarID   string `db:"user_avatar_id"`
		FriendID       string `db:"friend_id"`
		FriendName     string `db:"friend_name"`
		FriendFullName string `db:"friend_full_name"`
		FriendAvatarID string `db:"friend_avatar_id"`
	}
	err := r.db.Select(&items, `
		select f.friend_id as user_id, uf.name user_name, uf.full_name user_full_name, uf.avatar_thumbnail_id user_avatar_id,
		       f.user_id as friend_id, uu.name friend_name, uu.full_name friend_full_name, uu.avatar_thumbnail_id friend_avatar_id 
		from friends f
			inner join users uu on uu.id = f.user_id
			inner join users uf on uf.id = f.friend_id
		where f.user_id in (select friend_id from friends where user_id = $1)
			and f.friend_id not in (select friend_id from friends where user_id = $1)
		  	and not exists(
		  	    select *
		  	    from blocked_users bu
		  		where (bu.user_id = $1 and bu.blocked_user_id = f.friend_id)
		  		   or (bu.user_id = f.friend_id and bu.blocked_user_id = $1)) 
			and f.friend_id <> $1`,
		user.ID)
	if err != nil {
		panic(err)
	}

	for _, item := range items {
		user := User{
			ID:                item.UserID,
			Name:              item.UserName,
			FullName:          item.UserFullName,
			AvatarThumbnailID: item.UserAvatarID,
		}
		result[user] = append(result[user], User{
			ID:                item.FriendID,
			Name:              item.FriendName,
			FullName:          item.FriendFullName,
			AvatarThumbnailID: item.FriendAvatarID,
		})
	}

	return result
}

func (r *friendRepo) AreFriends(userID1, userID2 string) bool {
	var areFriends bool
	err := r.db.Get(&areFriends, `
		select case when exists(select * from friends where user_id = $1 and friend_id = $2) then true else false end
		`, userID1, userID2)
	if err != nil {
		panic(err)
	}
	return areFriends
}
