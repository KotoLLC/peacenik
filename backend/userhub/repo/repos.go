package repo

import (
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	User         UserRepo
	Invite       InviteRepo
	Friend       FriendRepo
	MessageHubs  MessageHubRepo
	Notification common.NotificationRepo
	FCMToken     FCMTokenRepo
	Setting      common.SettingRepo
}

func NewRepos(db *sqlx.DB) Repos {
	return Repos{
		User:         NewUsers(db),
		Invite:       NewInvites(db),
		Friend:       NewFriends(db),
		MessageHubs:  NewMessageHubs(db),
		Notification: common.NewNotifications(db),
		FCMToken:     NewFCMToken(db),
		Setting:      common.NewSettings(db),
	}
}
