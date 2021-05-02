package services

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
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
	rootEmailTemplate  *template.Template
	notifications      chan []Notification
	getUserAttachments func(ctx context.Context, userID string) common.MailAttachmentList
}

type Notification struct {
	UserIDs     []string               `json:"users"`
	Text        string                 `json:"text"`
	MessageType string                 `json:"message_type"`
	Data        map[string]interface{} `json:"data"`
	IsExternal  bool                   `json:"is_external"`
}

func NewNotificationSender(repos repo.Repos, userCache caches.Users, firebaseClient *fcm.Client, mailSender *common.MailSender, rootEmailTemplate *template.Template) NotificationSender {
	return &notificationSender{
		repos:             repos,
		userCache:         userCache,
		firebaseClient:    firebaseClient,
		mailSender:        mailSender,
		rootEmailTemplate: rootEmailTemplate,
		notifications:     make(chan []Notification, 10000),
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
	if !s.mailSender.Enabled() {
		return
	}

	var subject, body string
	switch n.MessageType {
	case "message/tag":
		userInfo := s.userCache.UserFullAccess(n.Data["user_id"].(string))
		var message bytes.Buffer
		err := s.rootEmailTemplate.ExecuteTemplate(&message, "message_mention.gohtml", map[string]interface{}{
			"UserDisplayName": userInfo.DisplayName,
			"MessageLink":     "", // TODO
		})
		if err != nil {
			log.Println("can't execute message_mention template:", err)
			return
		}
		subject = userInfo.DisplayName + " mentioned you in a message"
		body = message.String()
	case "message/post":
		_, isDirectMessage := n.Data["friend_id"]
		if !isDirectMessage {
			return
		}

		userInfo := s.userCache.UserFullAccess(n.Data["user_id"].(string))
		var message bytes.Buffer
		err := s.rootEmailTemplate.ExecuteTemplate(&message, "message_direct.gohtml", map[string]interface{}{
			"UserDisplayName": userInfo.DisplayName,
			"MessageLink":     "", // TODO
		})
		if err != nil {
			log.Println("can't execute message_mention template:", err)
			return
		}
		subject = userInfo.DisplayName + " sent you in a direct message"
		body = message.String()
	default:
		return
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
		body = strings.ReplaceAll(body, "@@avatar@@", userAttachments.InlineHTML("avatar")) // TODO
		err := s.mailSender.SendHTMLEmail([]string{userInfo.Email}, subject, body, userAttachments)
		if err != nil {
			log.Printf("can't send email to '%s': %v", userInfo.Email, err)
		}
	}
}

func (s *notificationSender) SetGetUserAttachments(getUserAttachments func(ctx context.Context, userID string) common.MailAttachmentList) {
	s.getUserAttachments = getUserAttachments
}
