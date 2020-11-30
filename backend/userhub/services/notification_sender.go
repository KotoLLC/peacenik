package services

import (
	"fmt"
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
	repos          repo.Repos
	firebaseClient *fcm.Client
	mailSender     *common.MailSender
	notifications  chan []Notification
}

type Notification struct {
	UserIDs     []string
	Text        string
	MessageType string
	Data        map[string]interface{}
	IsExternal  bool
}

func NewNotificationSender(repos repo.Repos, firebaseClient *fcm.Client, mailSender *common.MailSender) NotificationSender {
	return &notificationSender{
		repos:          repos,
		firebaseClient: firebaseClient,
		mailSender:     mailSender,
		notifications:  make(chan []Notification, 10000),
	}
}

func (s *notificationSender) SendNotification(userIDs []string, text, messageType string, data map[string]interface{}) {
	s.notifications <- []Notification{{
		UserIDs:     userIDs,
		Text:        text,
		MessageType: messageType,
		Data:        data,
		IsExternal:  false,
	}}
}

func (s *notificationSender) SendExternalNotifications(notifications []Notification) {
	for i := range notifications {
		notifications[i].IsExternal = true
	}
	s.notifications <- notifications
}

func (s *notificationSender) Start() {
	go func() {
		for ns := range s.notifications {
			for _, n := range ns {
				if !n.IsExternal {
					err := s.repos.Notification.AddNotifications(n.UserIDs, n.Text, n.MessageType, n.Data)
					if err != nil {
						log.Println("can't add notification to database:", err)
					}
				}

				s.sendEmailNotifications(n)
				s.sendFCMNotifications(n)
			}
		}
	}()
}

func (s *notificationSender) sendFCMNotifications(n Notification) {
	if s.firebaseClient == nil {
		return
	}

	fcmTokens, err := s.repos.FCMToken.UsersTokens(n.UserIDs)
	if err != nil {
		log.Println("can't load user fcm tokens:", err)
	}
	// TODO remove debug messages
	fmt.Println("Users:", n.UserIDs)
	fmt.Println("FCM Tokens:", fcmTokens)
	for _, fcmToken := range fcmTokens {
		resp, err := s.firebaseClient.SendWithRetry(&fcm.Message{
			To: fcmToken,
			Notification: &fcm.Notification{
				Title: "KOTO",
				Body:  n.Text,
			},
		}, 3)
		if err != nil {
			log.Println("can't send firebase notification:", err)
		} else if resp.Error != nil {
			log.Println("can't send firebase notification:", resp.Error)
		}
	}
}

func (s *notificationSender) sendEmailNotifications(n Notification) {
	if !s.mailSender.Enabled() {
		return
	}

	if n.MessageType != "message/tag" {
		return
	}

	for _, userID := range n.UserIDs {
		user, err := s.repos.User.FindUserByID(userID)
		if err != nil {
			log.Printf("can't find user by ID '%s': %v", userID, err)
			continue
		}
		err = s.mailSender.SendHTMLEmail([]string{user.Email}, "KOTO notification", n.Text)
		if err != nil {
			log.Printf("can't send email to '%s': %v", user.Email, err)
		}
	}
}
