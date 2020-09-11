package services

import (
	"log"

	"github.com/appleboy/go-fcm"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
)

type NotificationSender interface {
	Start()
	SendNotification(userID, text, messageType string, data map[string]interface{})
}

type notificationSender struct {
	notificationRepo common.NotificationRepo
	fcmTokenRepo     repo.FCMTokenRepo
	firebaseClient   *fcm.Client
	notifications    chan []notification
}

type notification struct {
	userID      string
	text        string
	messageType string
	data        map[string]interface{}
}

func NewNotificationSender(notificationRepo common.NotificationRepo, firebaseClient *fcm.Client) NotificationSender {
	return &notificationSender{
		notificationRepo: notificationRepo,
		firebaseClient:   firebaseClient,
		notifications:    make(chan []notification, 10000),
	}
}

func (n *notificationSender) SendNotification(userID, text, messageType string, data map[string]interface{}) {
	n.notifications <- []notification{{
		userID:      userID,
		text:        text,
		messageType: messageType,
		data:        data,
	}}
}

func (n *notificationSender) Start() {
	go func() {
		for ntfs := range n.notifications {
			for _, ntf := range ntfs {
				err := n.notificationRepo.AddNotification(ntf.userID, ntf.text, ntf.messageType, ntf.data)
				if err != nil {
					log.Println("can't add notification to database:", err)
				}

				if n.firebaseClient == nil {
					continue
				}

				fcmTokens, err := n.fcmTokenRepo.UserTokens(ntf.userID)
				if err != nil {
					log.Println("can't load user fcm tokens:", err)
				}

				for _, fcmToken := range fcmTokens {
					resp, err := n.firebaseClient.SendWithRetry(&fcm.Message{
						To: fcmToken,
						Notification: &fcm.Notification{
							Title: "KOTO",
							Body:  ntf.text,
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
