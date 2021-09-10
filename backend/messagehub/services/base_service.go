package services

import (
	"context"
	"net/http"
	"time"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/messagehub/repo"
	"github.com/mreider/koto/backend/token"
)

type ContextKey string

const (
	ContextUserKey ContextKey = "user"
)

type User struct {
	ID           string
	Name         string
	FullName     string
	IsHubAdmin   bool
	IsBlocked    bool
	BlockedUsers []string
	OwnedGroups  []string
}

func (u User) IsBlockedUser(userID string) bool {
	for _, id := range u.BlockedUsers {
		if id == userID {
			return true
		}
	}
	return false
}

func (u User) IsOwnedGroup(groupID string) bool {
	for _, id := range u.OwnedGroups {
		if id == groupID {
			return true
		}
	}
	return false
}

func (u User) DisplayName() string {
	if u.FullName == "" || u.FullName == u.Name {
		return u.Name
	}
	return u.FullName + " (" + u.Name + ")"
}

type BaseService struct {
	repos              repo.Repos
	tokenParser        token.Parser
	tokenGenerator     token.Generator
	externalAddress    string
	userHubAddress     string
	s3Storage          *common.S3Storage
	notificationSender NotificationSender
	userHubClient      *http.Client
}

func NewBase(repos repo.Repos, tokenParser token.Parser, tokenGenerator token.Generator, externalAddress, userHubAddress string, s3Storage *common.S3Storage, notificationSender NotificationSender) *BaseService {
	return &BaseService{
		repos:              repos,
		tokenParser:        tokenParser,
		tokenGenerator:     tokenGenerator,
		externalAddress:    externalAddress,
		userHubAddress:     userHubAddress,
		s3Storage:          s3Storage,
		notificationSender: notificationSender,
		userHubClient: &http.Client{
			Timeout: time.Second * 30,
		},
	}
}

func (s *BaseService) getMe(ctx context.Context) User {
	return ctx.Value(ContextUserKey).(User)
}

func (s *BaseService) createBlobLink(ctx context.Context, blobID string) (string, error) {
	if blobID == "" {
		return "", nil
	}
	return s.s3Storage.CreateLink(ctx, blobID, time.Hour*24)
}
