package service

import (
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/token"
)

type InviteService interface {
	Create(user repo.User, whomEmail, community string) (token string, err error)
	Accept(user repo.User, inviteToken string) error
}

type inviteService struct {
	users          repo.UserRepo
	relations      repo.RelationRepo
	tokenGenerator token.Generator
	tokenParser    token.Parser
}

func NewInvite(users repo.UserRepo, relations repo.RelationRepo, tokenGenerator token.Generator, tokenParser token.Parser) InviteService {
	return &inviteService{
		users:          users,
		relations:      relations,
		tokenGenerator: tokenGenerator,
		tokenParser:    tokenParser,
	}
}

func (s *inviteService) Create(user repo.User, whomEmail, community string) (token string, err error) {
	err = s.relations.AddRelation(user.ID, whomEmail, community)
	if err != nil {
		return "", err
	}

	claims := map[string]interface{}{
		"whom":      whomEmail,
		"community": community,
	}
	return s.tokenGenerator.Generate(user, "invite", time.Now().Add(time.Hour*24*7), claims)
}

func (s *inviteService) Accept(user repo.User, inviteToken string) error {
	jwtToken, err := s.tokenParser.Parse(inviteToken)
	if err != nil {
		return err
	}

	claims := jwtToken.Claims.(jwt.MapClaims)
	if claims["scope"].(string) != "invite" {
		return token.ErrInvalidToken
	}

	whomEmail := claims["whom"].(string)
	if whomEmail != user.Email {
		return token.ErrInvalidToken
	}

	return s.relations.AcceptRelation(claims["id"].(string), user.ID, user.Email, claims["community"].(string))
}
