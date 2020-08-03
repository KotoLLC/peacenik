package services

import (
	"context"
	"sort"
	"time"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/token"
)

type tokenService struct {
	*BaseService
	tokenGenerator token.Generator
	tokenDuration  time.Duration
}

func NewToken(base *BaseService, tokenGenerator token.Generator, tokenDuration time.Duration) rpc.TokenService {
	return &tokenService{
		BaseService:    base,
		tokenGenerator: tokenGenerator,
		tokenDuration:  tokenDuration,
	}
}

func (s *tokenService) Auth(ctx context.Context, _ *rpc.Empty) (*rpc.TokenAuthResponse, error) {
	user := s.getUser(ctx)

	authToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "auth", time.Now().Add(s.tokenDuration), nil)
	if err != nil {
		return nil, err
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, _ *rpc.Empty) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)

	nodes, err := s.repos.Node.ConnectedNodes(user)
	if err != nil {
		return nil, err
	}
	sort.Slice(nodes, func(i, j int) bool {
		if nodes[i].MinDistance < nodes[j].MinDistance {
			return true
		}

		if nodes[i].Count < nodes[j].Count {
			return true
		}

		if nodes[j].Node.ApprovedAt.Time.Before(nodes[i].Node.ApprovedAt.Time) {
			return true
		}

		return nodes[i].Node.Address < nodes[j].Node.Address
	})

	if len(nodes) > 1 {
		nodes = nodes[:1]
	}

	friends, err := s.repos.Friend.Friends(user)
	if err != nil {
		return nil, err
	}
	friendIDs := make([]string, len(friends))
	for i, friend := range friends {
		friendIDs[i] = friend.ID
	}
	sort.Slice(friendIDs, func(i, j int) bool {
		return friendIDs[i] < friendIDs[j]
	})

	tokens := make(map[string]string)
	exp := time.Now().Add(s.tokenDuration)
	for _, node := range nodes {
		claims := map[string]interface{}{
			"node":    node.Node.Address,
			"friends": friendIDs,
		}
		nodeToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "post-message", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[node.Node.Address] = nodeToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.TokenGetMessagesResponse, error) {
	user := s.getUser(ctx)

	nodes, err := s.repos.Node.ConnectedNodes(user)
	if err != nil {
		return nil, err
	}
	tokens := make(map[string]string)
	exp := time.Now().Add(s.tokenDuration)

	friends, err := s.repos.Friend.Friends(user)
	if err != nil {
		return nil, err
	}
	userIDs := make([]string, len(friends)+1)
	userIDs[0] = user.ID
	for i, u := range friends {
		userIDs[i+1] = u.ID
	}
	sort.Slice(userIDs, func(i, j int) bool {
		return userIDs[i] < userIDs[j]
	})

	for _, node := range nodes {
		claims := map[string]interface{}{
			"node":  node.Node.Address,
			"users": userIDs,
		}
		nodeToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "get-messages", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[node.Node.Address] = nodeToken
	}
	return &rpc.TokenGetMessagesResponse{
		Tokens: tokens,
	}, nil
}
