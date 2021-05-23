package repo

import (
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	db           *sqlx.DB
	User         UserRepo
	Invite       InviteRepo
	Friend       FriendRepo
	MessageHubs  MessageHubRepo
	Notification common.NotificationRepo
	FCMToken     FCMTokenRepo
	Setting      common.SettingRepo
	Group        GroupRepo
}

func NewRepos(db *sqlx.DB) Repos {
	return Repos{
		db:           db,
		User:         NewUsers(db),
		Invite:       NewInvites(db),
		Friend:       NewFriends(db),
		MessageHubs:  NewMessageHubs(db),
		Notification: common.NewNotifications(db),
		FCMToken:     NewFCMToken(db),
		Setting:      common.NewSettings(db),
		Group:        NewGroups(db),
	}
}

func (r Repos) DeleteUserData(userID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		r.FCMToken.DeleteUserTokens(tx, userID)
		r.Invite.DeleteUserInvites(tx, userID)
		r.Friend.DeleteUserFriends(tx, userID)
		r.Group.DeleteUserData(tx, userID)
		r.MessageHubs.DeleteUserData(tx, userID)
		r.User.DeleteUser(tx, userID)
		err := r.Notification.DeleteUserNotifications(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
}
