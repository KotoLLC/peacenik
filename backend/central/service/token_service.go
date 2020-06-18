package service

import (
	"context"
	"time"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/token"
)

type tokenService struct {
	*BaseService
	tokenGenerator token.Generator
}

func NewToken(base *BaseService, tokenGenerator token.Generator) rpc.TokenService {
	return &tokenService{
		BaseService:    base,
		tokenGenerator: tokenGenerator,
	}
}

func (s *tokenService) Auth(ctx context.Context, _ *rpc.Empty) (*rpc.TokenAuthResponse, error) {
	user := s.getUser(ctx)

	authToken, err := s.tokenGenerator.Generate(user, "auth", time.Now().Add(time.Minute*10), nil)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, r *rpc.TokenPostMessageRequest) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)

	userNodes, err := s.repos.Node.PostMessagesNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	nodeSet := make(map[string]bool)
	for _, node := range userNodes {
		nodeSet[node] = true
	}

	tokens := make([]string, len(r.Nodes))
	exp := time.Now().Add(time.Minute * 10)
	for i, node := range r.Nodes {
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
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, r *rpc.TokenGetMessagesRequest) (*rpc.TokenGetMessagesResponse, error) {
	user := s.getUser(ctx)

	getMessageNodes, err := s.repos.Node.GetMessageNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	getMessageNodeMap := make(map[string]repo.GetMessagesNode)
	for _, node := range getMessageNodes {
		getMessageNodeMap[node.Address] = node
	}

	tokens := make([]string, len(r.Nodes))
	exp := time.Now().Add(time.Minute * 10)
	for i, node := range r.Nodes {
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
	return &rpc.TokenGetMessagesResponse{
		Tokens: tokens,
	}, nil
}
