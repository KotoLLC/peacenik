package services

import (
	"context"
	"sort"
	"time"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/rpc"
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

	ownedHubs, err := s.repos.MessageHubs.Hubs(user)
	if err != nil {
		return nil, err
	}

	ownedHubAddresses := make([]string, len(ownedHubs))
	for i, hub := range ownedHubs {
		ownedHubAddresses[i] = hub.Address
	}

	blockedUserIDs, err := s.repos.User.BlockedUserIDs(user.ID)
	if err != nil {
		return nil, err
	}
	if blockedUserIDs == nil {
		blockedUserIDs = []string{}
	}

	claims := map[string]interface{}{
		"owned_hubs":    ownedHubAddresses,
		"blocked_users": blockedUserIDs,
	}

	authToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "auth", time.Now().Add(s.tokenDuration), claims)
	if err != nil {
		return nil, err
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, _ *rpc.Empty) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)

	hubs, err := s.repos.MessageHubs.ConnectedHubs(user)
	if err != nil {
		return nil, err
	}

	if len(hubs) == 0 {
		return &rpc.TokenPostMessageResponse{
			Tokens: nil,
		}, nil
	}

	sort.Slice(hubs, func(i, j int) bool {
		if hubs[i].MinDistance < hubs[j].MinDistance {
			return true
		}

		if hubs[i].Count < hubs[j].Count {
			return true
		}

		if hubs[j].Hub.ApprovedAt.Time.Before(hubs[i].Hub.ApprovedAt.Time) {
			return true
		}

		return hubs[i].Hub.Address < hubs[j].Hub.Address
	})

	hubs = hubs[:1]
	err = s.repos.MessageHubs.AssignUserToHub(user.ID, hubs[0].Hub.ID)
	if err != nil {
		return nil, err
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
	for _, hub := range hubs {
		claims := map[string]interface{}{
			"hub":     hub.Hub.Address,
			"friends": friendIDs,
		}
		hubToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "post-message", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[hub.Hub.Address] = hubToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.TokenGetMessagesResponse, error) {
	user := s.getUser(ctx)
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
	userHubs, err := s.repos.MessageHubs.UserHubs(userIDs)
	if err != nil {
		return nil, err
	}

	for hubAddress, hubUserIDs := range userHubs {
		claims := map[string]interface{}{
			"hub":   hubAddress,
			"users": hubUserIDs,
		}
		hubToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "get-messages", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[hubAddress] = hubToken
	}
	return &rpc.TokenGetMessagesResponse{
		Tokens: tokens,
	}, nil
}
