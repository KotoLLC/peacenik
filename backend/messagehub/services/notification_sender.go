package services

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/tidwall/sjson"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
)

type NotificationSender interface {
	Start()
	SendNotification(notification Notification)
}

type notificationSender struct {
	notificationRepo common.NotificationRepo
	externalAddress  string
	userHubEndpoint  string
	tokenGenerator   token.Generator
	userHubClient    *http.Client
	notifications    chan Notification
}

type Notification struct {
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
		notifications: make(chan Notification, 10000),
	}
}

func (n *notificationSender) SendNotification(notification Notification) {
	if len(notification.UserIDs) == 0 {
		return
	}

	n.notifications <- notification
}

func (n *notificationSender) Start() {
	go func() {
		var pendingNotifications []Notification
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

func (n *notificationSender) sendNotifications(notifications []Notification) {
	jsonNotifications, err := json.Marshal(notifications)
	if err != nil {
		log.Println("can't encode notifications:", err)
		return
	}
	body, err := sjson.SetBytes([]byte("{}"), "notifications", jsonNotifications)
	if err != nil {
		log.Println("can't encode body:", err)
		return
	}

	authToken, err := n.tokenGenerator.Generate(n.externalAddress, "auth", time.Now().Add(time.Minute*1), nil)
	if err != nil {
		log.Println("can't generate auth token:", err)
		return
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, n.userHubEndpoint, bytes.NewReader(body))
	if err != nil {
		log.Println("can't create notifications request:", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+authToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := n.userHubClient.Do(req)
	if err != nil {
		log.Println("can't post notifications request:", err)
		return
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		log.Printf("notifications response - unexpected status: %s. %s", resp.Status, string(respBody))
		return
	}
}
