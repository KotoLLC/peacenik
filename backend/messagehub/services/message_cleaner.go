package services

import (
	"context"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/tidwall/gjson"

	"github.com/mreider/koto/backend/messagehub/repo"
	"github.com/mreider/koto/backend/token"
)

const (
	defaultGuestExpirationPeriodInDays = 30
)

func NewMessageCleaner(externalAddress, apiEndpoint string, tokenGenerator token.Generator) *MessageCleaner {
	return &MessageCleaner{
		externalAddress: externalAddress,
		apiEndpoint:     apiEndpoint,
		tokenGenerator:  tokenGenerator,
		userHubClient: &http.Client{
			Timeout: time.Second * 30,
		},
	}
}

type MessageCleaner struct {
	externalAddress string
	apiEndpoint     string
	tokenGenerator  token.Generator
	userHubClient   *http.Client

	expirationDays int
}

func (mc *MessageCleaner) DeleteExpiredMessages(messageRepo repo.MessageRepo) {
	// Delay to start the service.
	time.Sleep(time.Second * 10)

	mc.deleteExpiredMessages(messageRepo)

	ticker := time.NewTicker(time.Hour * 1)
	defer ticker.Stop()

	for range ticker.C {
		mc.deleteExpiredMessages(messageRepo)
	}
}

func (mc *MessageCleaner) deleteExpiredMessages(messageRepo repo.MessageRepo) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("can't delete expired messages:", r)
		}
	}()

	mc.updateExpirationDays()
	expirationDays := mc.expirationDays
	onlyGuestMessages := false
	if mc.expirationDays == 0 {
		expirationDays = defaultGuestExpirationPeriodInDays
		onlyGuestMessages = true
	}

	until := time.Now().UTC().AddDate(0, 0, -expirationDays)
	messageRepo.DeleteExpiredMessages(until, onlyGuestMessages)
}

func (mc *MessageCleaner) updateExpirationDays() {
	authToken, err := mc.tokenGenerator.Generate(mc.externalAddress, "auth", time.Now().Add(time.Minute*1), nil)
	if err != nil {
		log.Println("can't generate auth token:", err)
		return
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, mc.apiEndpoint, strings.NewReader("{}"))
	if err != nil {
		log.Println("can't create expiration_days request:", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+authToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := mc.userHubClient.Do(req)
	if err != nil {
		log.Println("can't post expiration_days request:", err)
		return
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		log.Printf("expiration_days response - unexpected status: %s. %s", resp.Status, string(respBody))
		return
	}

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("can't read expiration_days response:", err)
		return
	}
	if !gjson.ValidBytes(respBody) {
		log.Println("expiration_days response is not valid json")
		return
	}
	expirationDays := gjson.GetBytes(respBody, "expiration_days")
	if !expirationDays.Exists() || expirationDays.Type != gjson.Number {
		log.Println("expiration_days response is not valid")
		return
	}

	newExpirationDays := int(expirationDays.Int())
	if newExpirationDays != mc.expirationDays {
		log.Printf("'Expiration days' is updated from %d to %d", mc.expirationDays, newExpirationDays)
		mc.expirationDays = newExpirationDays
	}
}
