package services

import (
	"context"
	"fmt"
	"html"
	"log"
	"strings"

	"github.com/appleboy/go-fcm"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/repo"
)

type NotificationSender interface {
	Start()
	SendNotification(userIDs []string, text, messageType string, data map[string]interface{})
	SendExternalNotifications(notifications []Notification)
	SetGetUserAttachments(getUserAttachments func(ctx context.Context, userID string) common.MailAttachmentList)
}

type notificationSender struct {
	repos              repo.Repos
	userCache          caches.Users
	firebaseClient     *fcm.Client
	mailSender         *common.MailSender
	notifications      chan []Notification
	getUserAttachments func(ctx context.Context, userID string) common.MailAttachmentList
}

type Notification struct {
	UserIDs     []string
	Text        string
	MailSubject string
	MailBody    string
	MessageType string
	Data        map[string]interface{}
	IsExternal  bool
}

func NewNotificationSender(repos repo.Repos, userCache caches.Users, firebaseClient *fcm.Client, mailSender *common.MailSender) NotificationSender {
	return &notificationSender{
		repos:          repos,
		userCache:      userCache,
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

	fcmTokens := s.repos.FCMToken.UsersTokens(n.UserIDs)
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
	if !s.mailSender.Enabled() || (n.MailSubject == "" && n.MailBody == "") {
		return
	}

	if n.MailSubject == "" {
		n.MailSubject = n.Text
	} else if n.MailBody == "" {
		n.MailBody = html.EscapeString(n.Text)
	}

	var userAttachments common.MailAttachmentList
	userID, ok := n.Data["user_id"].(string)
	if ok {
		if s.getUserAttachments != nil {
			userAttachments = s.getUserAttachments(context.TODO(), userID)
		}
	}

	for _, userID := range n.UserIDs {
		user := s.repos.User.FindUserByID(userID)
		if user == nil {
			continue
		}
		userInfo := s.userCache.UserFullAccess(user.ID)
		var body = strings.ReplaceAll(n.MailBody, "@@avatar@@", userAttachments.InlineHTML("avatar"))
		err := s.mailSender.SendHTMLEmail([]string{userInfo.Email}, n.MailSubject, body, userAttachments)
		if err != nil {
			log.Printf("can't send email to '%s': %v", userInfo.Email, err)
		}
	}
}

func (s *notificationSender) SetGetUserAttachments(getUserAttachments func(ctx context.Context, userID string) common.MailAttachmentList) {
	s.getUserAttachments = getUserAttachments
}
