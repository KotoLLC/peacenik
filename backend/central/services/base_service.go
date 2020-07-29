package services

import (
	"context"
	"time"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/common"
)

type BaseService struct {
	repos     repo.Repos
	s3Storage *common.S3Storage
}

func NewBase(repos repo.Repos, s3Storage *common.S3Storage) *BaseService {
	return &BaseService{
		repos:     repos,
		s3Storage: s3Storage,
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
	return ctx.Value(ContextIsAdminKey).(bool)
}

func (s *BaseService) createBlobLink(ctx context.Context, blobID string) (string, error) {
	if blobID == "" {
		return "", nil
	}
	return s.s3Storage.CreateLink(ctx, blobID, time.Hour*24)
}
