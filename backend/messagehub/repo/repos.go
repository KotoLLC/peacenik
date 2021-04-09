package repo

import (
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

func NewRepos(db *sqlx.DB) Repos {
	return Repos{
		db:           db,
		Message:      NewMessages(db),
		Notification: common.NewNotifications(db),
		User:         NewUsers(db),
		Setting:      common.NewSettings(db),
	}
}

type Repos struct {
	db           *sqlx.DB
	Message      MessageRepo
	Notification common.NotificationRepo
	User         UserRepo
	Setting      common.SettingRepo
}

func (r Repos) DeleteUserData(userID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		err := r.Message.DeleteUserData(tx, userID)
		if err != nil {
			return err
		}
		err = r.Notification.DeleteUserNotifications(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
}
