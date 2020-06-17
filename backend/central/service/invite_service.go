package service

import (
	"time"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/token"
)

type InviteService interface {
	Create(user repo.User, whomEmail string) (token string, err error)
	Accept(user repo.User, inviteToken string) error
}

type inviteService struct {
	users          repo.UserRepo
	invites        repo.InviteRepo
	tokenGenerator token.Generator
	tokenParser    token.Parser
}

func NewInvite(users repo.UserRepo, invites repo.InviteRepo, tokenGenerator token.Generator, tokenParser token.Parser) InviteService {
	return &inviteService{
		users:          users,
		invites:        invites,
		tokenGenerator: tokenGenerator,
		tokenParser:    tokenParser,
	}
}

func (s *inviteService) Create(user repo.User, whomEmail string) (token string, err error) {
	err = s.invites.AddInvite(user.ID, whomEmail)
	if err != nil {
		return "", err
	}

	claims := map[string]interface{}{
		"whom": whomEmail,
	}
	return s.tokenGenerator.Generate(user, "invite", time.Now().Add(time.Hour*24*7), claims)
}

func (s *inviteService) Accept(user repo.User, inviteToken string) error {
	_, claims, err := s.tokenParser.Parse(inviteToken, "invite")
	if err != nil {
		return err
	}

	whomEmail := claims["whom"].(string)
	if whomEmail != user.Email {
		return token.ErrInvalidToken
	}

	return s.invites.AcceptInvite(claims["id"].(string), user.ID, user.Email)
}
