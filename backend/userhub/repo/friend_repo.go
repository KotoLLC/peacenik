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
		select friend_id as id
		from friends
		where user_id = $1;`,
		user.ID)
	if err != nil {
		panic(err)
	}
	return friends
}

func (r *friendRepo) FriendsWithSubFriends(user User) map[User][]User {
	result := make(map[User][]User)

	var items []struct {
		UserID   string `db:"user_id"`
		FriendID string `db:"friend_id"`
	}
	err := r.db.Select(&items, `
		select f.user_id as user_id, f.friend_id as friend_id
		from friends f
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
			ID: item.UserID,
		}
		result[user] = append(result[user], User{
			ID: item.FriendID,
		})
	}

	return result
}

func (r *friendRepo) FriendsOfFriends(user User) map[User][]User {
	result := make(map[User][]User)

	var items []struct {
		UserID   string `db:"user_id"`
		FriendID string `db:"friend_id"`
	}
	err := r.db.Select(&items, `
		select f.friend_id as user_id, f.user_id as friend_id 
		from friends f
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
			ID: item.UserID,
		}
		result[user] = append(result[user], User{
			ID: item.FriendID,
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
