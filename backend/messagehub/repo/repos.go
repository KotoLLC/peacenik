package repo

import (
	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	Message      MessageRepo
	Notification common.NotificationRepo
	User         UserRepo
}
