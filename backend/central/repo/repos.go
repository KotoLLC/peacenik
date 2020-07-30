package repo

import (
	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	User         UserRepo
	Invite       InviteRepo
	Friend       FriendRepo
	Node         NodeRepo
	Notification common.NotificationRepo
}
