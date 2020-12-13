package repo

import (
	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	db *sqlx.DB

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
		db:           db,
		User:         NewUsers(db),
		Invite:       NewInvites(db),
		Friend:       NewFriends(db),
		MessageHubs:  NewMessageHubs(db),
		Notification: common.NewNotifications(db),
		FCMToken:     NewFCMToken(db),
		Setting:      common.NewSettings(db),
	}
}

func (r Repos) DropDatabase(databaseName string) error {
	_, err := r.db.Exec(`drop database ` + databaseName)
	if err != nil {
		return merry.Prepend(err, "can't drop database")
	}
	return nil
}
