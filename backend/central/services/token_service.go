package services

import (
	"context"
	"sort"
	"time"

	"github.com/twitchtv/twirp"

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

	authToken, err := s.tokenGenerator.Generate(user, "auth", time.Now().Add(time.Minute*60), nil)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, _ *rpc.Empty) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)

	nodes, _, err := s.repos.Node.UserNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	sort.Slice(nodes, func(i, j int) bool {
		if nodes[i].MinDistance < nodes[j].MinDistance {
			return true
		}

		if nodes[i].Count < nodes[j].Count {
			return true
		}

		if nodes[i].Node.ApprovedAt > nodes[j].Node.ApprovedAt {
			return true
		}

		return nodes[i].Node.Address < nodes[j].Node.Address
	})

	if len(nodes) > 1 {
		nodes = nodes[:1]
	}

	tokens := make(map[string]string)
	exp := time.Now().Add(time.Minute * 60)
	for _, node := range nodes {
		claims := map[string]interface{}{"node": node.Node.Address}
		nodeToken, err := s.tokenGenerator.Generate(user, "post-message", exp, claims)
		if err != nil {
			return nil, err
		}
		tokens[node.Node.Address] = nodeToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.TokenGetMessagesResponse, error) {
	user := s.getUser(ctx)

	nodes, userIDs, err := s.repos.Node.UserNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	tokens := make(map[string]string)
	exp := time.Now().Add(time.Minute * 60)
	for _, node := range nodes {
		claims := map[string]interface{}{
			"node":  node.Node.Address,
			"users": userIDs,
		}
		nodeToken, err := s.tokenGenerator.Generate(user, "get-messages", exp, claims)
		if err != nil {
			return nil, err
		}
		tokens[node.Node.Address] = nodeToken
	}
	return &rpc.TokenGetMessagesResponse{
		Tokens: tokens,
	}, nil
}
