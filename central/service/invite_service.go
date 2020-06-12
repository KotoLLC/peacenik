package service

import (
	"time"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/token"
)

type InviteService interface {
	Token(user repo.User, whomEmail string) (token string, err error)
}

type inviteService struct {
	users          repo.UserRepo
	tokenGenerator token.Generator
}

func NewInvite(users repo.UserRepo, tokenGenerator token.Generator) InviteService {
	return &inviteService{
		users:          users,
		tokenGenerator: tokenGenerator,
	}
}

func (s *inviteService) Token(user repo.User, whomEmail string) (token string, err error) {
	claims := map[string]interface{}{"whom": whomEmail}
	return s.tokenGenerator.Generate(user, "invite", time.Now().Add(time.Hour*24*7), claims)
}
