package services

import (
	"log"

	"github.com/appleboy/go-fcm"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
)

type NotificationSender interface {
	Start()
	SendNotification(userIDs []string, text, messageType string, data map[string]interface{})
	SendExternalNotifications(notifications []Notification)
}

type notificationSender struct {
	notificationRepo common.NotificationRepo
	fcmTokenRepo     repo.FCMTokenRepo
	firebaseClient   *fcm.Client
	notifications    chan []Notification
}

type Notification struct {
	UserIDs     []string
	Text        string
	MessageType string
	Data        map[string]interface{}
	IsExternal  bool
}

func NewNotificationSender(notificationRepo common.NotificationRepo, firebaseClient *fcm.Client) NotificationSender {
	return &notificationSender{
		notificationRepo: notificationRepo,
		firebaseClient:   firebaseClient,
		notifications:    make(chan []Notification, 10000),
	}
}

func (n *notificationSender) SendNotification(userIDs []string, text, messageType string, data map[string]interface{}) {
	n.notifications <- []Notification{{
		UserIDs:     userIDs,
		Text:        text,
		MessageType: messageType,
		Data:        data,
		IsExternal:  false,
	}}
}

func (n *notificationSender) SendExternalNotifications(notifications []Notification) {
	for i := range notifications {
		notifications[i].IsExternal = true
	}
	n.notifications <- notifications
}

func (n *notificationSender) Start() {
	go func() {
		for ntfs := range n.notifications {
			for _, ntf := range ntfs {
				if !ntf.IsExternal {
					err := n.notificationRepo.AddNotifications(ntf.UserIDs, ntf.Text, ntf.MessageType, ntf.Data)
					if err != nil {
						log.Println("can't add notification to database:", err)
					}
				}

				if n.firebaseClient == nil {
					continue
				}

				fcmTokens, err := n.fcmTokenRepo.UsersTokens(ntf.UserIDs)
				if err != nil {
					log.Println("can't load user fcm tokens:", err)
				}
				for _, fcmToken := range fcmTokens {
					resp, err := n.firebaseClient.SendWithRetry(&fcm.Message{
						To: fcmToken,
						Notification: &fcm.Notification{
							Title: "KOTO",
							Body:  ntf.Text,
						},
					}, 3)
					if err != nil {
						log.Println("can't send firebase notification:", err)
					} else if resp.Error != nil {
						log.Println("can't send firebase notification:", resp.Error)
					}
				}
			}
		}
	}()
}
