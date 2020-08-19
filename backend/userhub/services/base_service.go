package services

import (
	"context"
	"time"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/repo"
)

type BaseService struct {
	repos           repo.Repos
	s3Storage       *common.S3Storage
	tokenGenerator  token.Generator
	tokenParser     token.Parser
	mailSender      *common.MailSender
	frontendAddress string
}

func NewBase(repos repo.Repos, s3Storage *common.S3Storage, tokenGenerator token.Generator, tokenParser token.Parser,
	mailSender *common.MailSender, frontendAddress string) *BaseService {
	return &BaseService{
		repos:           repos,
		s3Storage:       s3Storage,
		tokenGenerator:  tokenGenerator,
		tokenParser:     tokenParser,
		mailSender:      mailSender,
		frontendAddress: frontendAddress,
	}
}

func (s *BaseService) getUser(ctx context.Context) repo.User {
	return ctx.Value(ContextUserKey).(repo.User)
}

func (s *BaseService) hasUser(ctx context.Context) bool {
	_, ok := ctx.Value(ContextUserKey).(repo.User)
	return ok
}

func (s *BaseService) isAdmin(ctx context.Context) bool {
	isAdmin, _ := ctx.Value(ContextIsAdminKey).(bool)
	return isAdmin
}

func (s *BaseService) createBlobLink(ctx context.Context, blobID string) (string, error) {
	if blobID == "" {
		return "", nil
	}
	return s.s3Storage.CreateLink(ctx, blobID, time.Hour*24)
}
