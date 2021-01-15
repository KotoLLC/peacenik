package services

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
)

type NotificationSender interface {
	Start()
	SendNotification(userIDs []string, text, messageType string, data map[string]interface{})
}

type notificationSender struct {
	notificationRepo common.NotificationRepo
	externalAddress  string
	userHubEndpoint  string
	tokenGenerator   token.Generator
	userHubClient    *http.Client
	notifications    chan notification
}

type notification struct {
	UserIDs     []string               `json:"users"`
	Text        string                 `json:"text"`
	MessageType string                 `json:"message_type"`
	Data        map[string]interface{} `json:"data"`
}

func NewNotificationSender(notificationRepo common.NotificationRepo, externalAddress, userHubEndpoint string,
	tokenGenerator token.Generator) NotificationSender {
	return &notificationSender{
		notificationRepo: notificationRepo,
		externalAddress:  externalAddress,
		userHubEndpoint:  userHubEndpoint,
		tokenGenerator:   tokenGenerator,
		userHubClient: &http.Client{
			Timeout: time.Second * 30,
		},
		notifications: make(chan notification, 10000),
	}
}

func (n *notificationSender) SendNotification(userIDs []string, text, messageType string, data map[string]interface{}) {
	if len(userIDs) == 0 {
		return
	}

	n.notifications <- notification{
		UserIDs:     userIDs,
		Text:        text,
		MessageType: messageType,
		Data:        data,
	}
}

func (n *notificationSender) Start() {
	go func() {
		var pendingNotifications []notification
		ticker := time.NewTicker(time.Second * 10)
		defer ticker.Stop()

		for {
			select {
			case ntf := <-n.notifications:
				err := n.notificationRepo.AddNotifications(ntf.UserIDs, ntf.Text, ntf.MessageType, ntf.Data)
				if err != nil {
					log.Println("can't add notification to database:", err)
				}

				pendingNotifications = append(pendingNotifications, ntf)
				if len(pendingNotifications) >= 100 {
					n.sendNotifications(pendingNotifications)
					pendingNotifications = pendingNotifications[:0]
				}
			case <-ticker.C:
				if len(pendingNotifications) > 0 {
					n.sendNotifications(pendingNotifications)
					pendingNotifications = pendingNotifications[:0]
				}
			}
		}
	}()
}

func (n *notificationSender) sendNotifications(notifications []notification) {
	claims := map[string]interface{}{
		"notifications": notifications,
	}
	notificationsToken, err := n.tokenGenerator.Generate(n.externalAddress, "notifications",
		time.Now().Add(time.Minute*1), claims)
	if err != nil {
		log.Println("can't generate notifications token:", err)
		return
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, n.userHubEndpoint,
		strings.NewReader(fmt.Sprintf(`{"node": "%s", "notifications_token": "%s"}`, n.externalAddress, notificationsToken)))
	if err != nil {
		log.Println("can't generate notifications request:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := n.userHubClient.Do(req)
	if err != nil {
		log.Println("can't post notifications request:", err)
		return
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		log.Println("notifications response - unexpected status:", resp.Status)
		return
	}
}
