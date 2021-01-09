package repo

import (
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

func NewRepos(db *sqlx.DB) Repos {
	return Repos{
		Message:      NewMessages(db),
		Notification: common.NewNotifications(db),
		User:         NewUsers(db),
		Setting:      common.NewSettings(db),
	}
}

type Repos struct {
	Message      MessageRepo
	Notification common.NotificationRepo
	User         UserRepo
	Setting      common.SettingRepo
}
