package services

import (
	"context"

	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/token"
)

type ContextKey string

const (
	ContextUserKey ContextKey = "user"
)

type User struct {
	ID string
}

type BaseService struct {
	repos           repo.Repos
	tokenParser     token.Parser
	externalAddress string
}

func NewBase(repos repo.Repos, tokenParser token.Parser, externalAddress string) *BaseService {
	return &BaseService{
		repos:           repos,
		tokenParser:     tokenParser,
		externalAddress: externalAddress,
	}
}

func (s *BaseService) getUser(ctx context.Context) User {
	return ctx.Value(ContextUserKey).(User)
}
