package repo

import (
	"github.com/mreider/koto/backend/common"
)

type Repos struct {
	User         UserRepo
	Invite       InviteRepo
	Friend       FriendRepo
	MessageHubs  MessageHubRepo
	Notification common.NotificationRepo
	FCMToken     FCMTokenRepo
}
