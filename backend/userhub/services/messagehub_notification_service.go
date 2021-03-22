package services

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/rpc"
)

type messageHubNotificationService struct {
	*BaseService
	tokenParsers   map[string]token.Parser
	tokenParsersMu sync.Mutex
}

func NewMessageHubNotification(base *BaseService) rpc.MessageHubNotificationService {
	return &messageHubNotificationService{
		BaseService:  base,
		tokenParsers: make(map[string]token.Parser),
	}
}

func (s *messageHubNotificationService) PostNotifications(ctx context.Context, r *rpc.MessageHubNotificationPostNotificationsRequest) (*rpc.Empty, error) {
	tokenParser, err := s.getTokenParser(ctx, r.Node)
	if err != nil {
		return nil, err
	}
	_, claims, err := tokenParser.Parse(r.NotificationsToken, "notifications")
	if err != nil {
		return nil, err
	}
	if claimsAddress, ok := claims["id"].(string); !ok || claimsAddress != r.Node {
		return nil, twirp.InvalidArgumentError("token", "is invalid")
	}
	var rawNotifications []interface{}
	var ok bool
	if rawNotifications, ok = claims["notifications"].([]interface{}); !ok {
		return nil, twirp.InvalidArgumentError("token", "is invalid")
	}
	notifications := make([]Notification, len(rawNotifications))
	for i, rawNotification := range rawNotifications {
		rawNotification := rawNotification.(map[string]interface{})
		rawUserIDs := rawNotification["users"].([]interface{})
		userIDs := make([]string, len(rawUserIDs))
		for i, rawUserID := range rawUserIDs {
			userIDs[i] = rawUserID.(string)
		}
		text, _ := rawNotification["text"].(string)
		messageType, _ := rawNotification["message_type"].(string)
		data, _ := rawNotification["data"].(map[string]interface{})
		notifications[i] = Notification{
			UserIDs:     userIDs,
			Text:        text,
			MessageType: messageType,
			Data:        data,
			IsExternal:  true,
		}
	}
	s.notificationSender.SendExternalNotifications(notifications)
	return &rpc.Empty{}, nil
}

func (s *messageHubNotificationService) getTokenParser(ctx context.Context, nodeAddress string) (token.Parser, error) {
	s.tokenParsersMu.Lock()
	defer s.tokenParsersMu.Unlock()

	if parser, ok := s.tokenParsers[nodeAddress]; ok {
		return parser, nil
	}
	nodePublicKey, err := loadNodePublicKey(ctx, nodeAddress)
	if err != nil {
		return nil, merry.Prepend(err, "can't load message hub public key")
	}
	parser := token.NewParser(func() *rsa.PublicKey {
		return nodePublicKey
	})
	s.tokenParsers[nodeAddress] = parser
	return parser, nil
}

func loadNodePublicKey(ctx context.Context, nodeAddress string) (*rsa.PublicKey, error) {
	client := &http.Client{
		Timeout: time.Second * 30,
	}
	r, err := http.NewRequestWithContext(ctx, http.MethodPost,
		fmt.Sprintf("%s/rpc.InfoService/PublicKey", strings.TrimSuffix(nodeAddress, "/")),
		strings.NewReader("{}"))
	if err != nil {
		return nil, merry.Wrap(err)
	}
	r.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(r)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	defer func() { _ = resp.Body.Close() }()
	var body struct {
		PublicKey string `json:"public_key"`
	}
	err = json.NewDecoder(resp.Body).Decode(&body)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(body.PublicKey))
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return key, nil
}
