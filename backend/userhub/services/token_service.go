package services

import (
	"context"
	"sort"
	"time"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/repo"
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

	ownedHubs := s.repos.MessageHubs.Hubs(user)
	ownedHubAddresses := make([]string, len(ownedHubs))
	for i, hub := range ownedHubs {
		ownedHubAddresses[i] = hub.Address
	}

	blockedUserIDs := s.repos.User.BlockedUserIDs(user.ID)
	if blockedUserIDs == nil {
		blockedUserIDs = []string{}
	}

	claims := map[string]interface{}{
		"owned_hubs":    ownedHubAddresses,
		"blocked_users": blockedUserIDs,
		"full_name":     user.FullName,
	}

	authToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "auth", time.Now().Add(s.tokenDuration), claims)
	if err != nil {
		return nil, err
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, r *rpc.TokenPostMessageRequest) (*rpc.TokenPostMessageResponse, error) {
	if r.GroupId == "" {
		return s.postMessage(ctx)
	}
	return s.postMessageForGroup(ctx, r.GroupId)
}

func (s *tokenService) postMessage(ctx context.Context) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)

	hubs := s.repos.MessageHubs.ConnectedHubs(user)
	if len(hubs) == 0 {
		return &rpc.TokenPostMessageResponse{
			Tokens: nil,
		}, nil
	}

	sort.Slice(hubs, func(i, j int) bool {
		if hubs[i].MinDistance < hubs[j].MinDistance {
			return true
		}
		if hubs[j].MinDistance < hubs[i].MinDistance {
			return false
		}

		if hubs[i].Count < hubs[j].Count {
			return true
		}
		if hubs[j].Count < hubs[i].Count {
			return false
		}

		if hubs[j].Hub.ApprovedAt.Time.Before(hubs[i].Hub.ApprovedAt.Time) {
			return true
		}
		if hubs[i].Hub.ApprovedAt.Time.Before(hubs[j].Hub.ApprovedAt.Time) {
			return false
		}

		return hubs[i].Hub.Address < hubs[j].Hub.Address
	})

	hubs = hubs[:1]
	s.repos.MessageHubs.AssignUserToHub(user.ID, hubs[0].Hub.ID, hubs[0].MinDistance)

	friends := s.repos.Friend.Friends(user)
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
			"hub":          hub.Hub.Address,
			"friends":      friendIDs,
			"is_guest_hub": hub.MinDistance == repo.GuestHubDistance,
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

func (s *tokenService) postMessageForGroup(ctx context.Context, groupID string) (*rpc.TokenPostMessageResponse, error) {
	user := s.getUser(ctx)
	group, _ := s.getGroup(ctx, groupID)
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if !s.repos.Group.IsGroupMember(groupID, user.ID) {
		return nil, twirp.NotFoundError("group not found")
	}

	adminHub := s.repos.MessageHubs.GroupHub(group.AdminID)
	tokens := make(map[string]string)
	if adminHub != "" {
		exp := time.Now().Add(s.tokenDuration)
		claims := map[string]interface{}{
			"hub":      adminHub,
			"group_id": groupID,
		}
		hubToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "post-message", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[adminHub] = hubToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.TokenGetMessagesResponse, error) {
	user := s.getUser(ctx)
	tokens := make(map[string]string)
	exp := time.Now().Add(s.tokenDuration)

	friends := s.repos.Friend.Friends(user)
	userIDs := make([]string, len(friends)+1)
	userIDs[0] = user.ID
	for i, u := range friends {
		userIDs[i+1] = u.ID
	}
	userHubs := s.repos.MessageHubs.UserHubs(userIDs)

	groupHubs := make(map[string][]string)
	userGroups := s.repos.Group.UserGroups(user.ID)
	for _, group := range userGroups {
		adminHubs := s.repos.MessageHubs.UserHubs([]string{group.AdminID})
		for adminHub := range adminHubs {
			groupHubs[adminHub] = append(groupHubs[adminHub], group.ID)
		}
	}

	allHubs := make([]string, 0, len(userHubs)+len(groupHubs))
	for userHub := range userHubs {
		allHubs = append(allHubs, userHub)
	}
Loop:
	for groupHub := range groupHubs {
		for _, hub := range allHubs {
			if hub == groupHub {
				continue Loop
			}
		}
		allHubs = append(allHubs, groupHub)
	}

	for _, hubAddress := range allHubs {
		claims := map[string]interface{}{
			"hub": hubAddress,
		}
		if hubUserIDs, ok := userHubs[hubAddress]; ok {
			claims["users"] = hubUserIDs
		}
		if hubGroupIDs, ok := groupHubs[hubAddress]; ok {
			claims["groups"] = hubGroupIDs
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
