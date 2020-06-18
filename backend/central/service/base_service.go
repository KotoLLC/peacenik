package service

import (
	"context"

	"github.com/mreider/koto/backend/central/repo"
)

type BaseService struct {
	repos repo.Repos
}

func NewBaseService(repos repo.Repos) *BaseService {
	return &BaseService{
		repos: repos,
	}
}

func (s *BaseService) getUser(ctx context.Context) repo.User {
	return ctx.Value(ContextUserKey).(repo.User)
}
