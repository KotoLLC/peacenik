package service

import (
	"time"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/token"
)

type TokenService interface {
	Auth(user repo.User) (token string, err error)
	PostMessage(user repo.User, nodes []string) (tokens []string, err error)
	GetMessages(user repo.User, nodes []string) (tokens []string, err error)
}

type tokenService struct {
	nodeRepo       repo.NodeRepo
	tokenGenerator token.Generator
}

func NewToken(nodeRepo repo.NodeRepo, tokenGenerator token.Generator) TokenService {
	return &tokenService{
		nodeRepo:       nodeRepo,
		tokenGenerator: tokenGenerator,
	}
}

func (s *tokenService) Auth(user repo.User) (token string, err error) {
	return s.tokenGenerator.Generate(user, "auth", time.Now().Add(time.Minute*10), nil)
}

func (s *tokenService) PostMessage(user repo.User, nodes []string) (tokens []string, err error) {
	userNodes, err := s.nodeRepo.PostMessagesNodes(user)
	if err != nil {
		return nil, err
	}
	nodeSet := make(map[string]bool)
	for _, node := range userNodes {
		nodeSet[node] = true
	}

	tokens = make([]string, len(nodes))
	exp := time.Now().Add(time.Minute * 10)
	for i, node := range nodes {
		if nodeSet[node] {
			claims := map[string]interface{}{"node": node}
			nodeToken, err := s.tokenGenerator.Generate(user, "post-message", exp, claims)
			if err != nil {
				return nil, err
			}
			tokens[i] = nodeToken
		} else {
			tokens[i] = ""
		}
	}
	return tokens, nil
}

func (s *tokenService) GetMessages(user repo.User, nodes []string) (tokens []string, err error) {
	getMessageNodes, err := s.nodeRepo.GetMessageNodes(user)
	if err != nil {
		return nil, err
	}
	getMessageNodeMap := make(map[string]repo.GetMessagesNode)
	for _, node := range getMessageNodes {
		getMessageNodeMap[node.Address] = node
	}

	tokens = make([]string, len(nodes))
	exp := time.Now().Add(time.Minute * 10)
	for i, node := range nodes {
		if getMessagesNode, ok := getMessageNodeMap[node]; ok {
			claims := map[string]interface{}{
				"node":  getMessagesNode.Address,
				"users": getMessagesNode.Friends,
			}
			nodeToken, err := s.tokenGenerator.Generate(user, "get-messages", exp, claims)
			if err != nil {
				return nil, err
			}
			tokens[i] = nodeToken
		} else {
			tokens[i] = ""
		}
	}
	return tokens, nil
}
