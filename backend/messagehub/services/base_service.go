package services

import (
	"context"
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
	ID         string
	Name       string
	IsHubAdmin bool
	IsBlocked  bool
}

type BaseService struct {
	repos              repo.Repos
	tokenParser        token.Parser
	externalAddress    string
	s3Storage          *common.S3Storage
	notificationSender NotificationSender
}

func NewBase(repos repo.Repos, tokenParser token.Parser, externalAddress string, s3Storage *common.S3Storage, notificationSender NotificationSender) *BaseService {
	return &BaseService{
		repos:              repos,
		tokenParser:        tokenParser,
		externalAddress:    externalAddress,
		s3Storage:          s3Storage,
		notificationSender: notificationSender,
	}
}

func (s *BaseService) getUser(ctx context.Context) User {
	return ctx.Value(ContextUserKey).(User)
}

func (s *BaseService) createBlobLink(ctx context.Context, blobID string) (string, error) {
	if blobID == "" {
		return "", nil
	}
	return s.s3Storage.CreateLink(ctx, blobID, time.Hour*24)
}
