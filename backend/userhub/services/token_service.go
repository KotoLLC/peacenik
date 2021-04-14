package services

import (
	"context"
	"encoding/hex"
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
	me := s.getMe(ctx)

	ownedHubs := s.repos.MessageHubs.Hubs(me)
	ownedHubAddresses := make([]string, len(ownedHubs))
	for i, hub := range ownedHubs {
		ownedHubAddresses[i] = hub.Address
	}

	blockedUserIDs := s.repos.User.BlockedUserIDs(me.ID)
	if blockedUserIDs == nil {
		blockedUserIDs = []string{}
	}

	meInfo := s.userCache.UserFullAccess(me.ID)
	claims := map[string]interface{}{
		"owned_hubs":    ownedHubAddresses,
		"blocked_users": blockedUserIDs,
		"name":          meInfo.Name,
		"full_name":     meInfo.FullName,
		"hide_identity": meInfo.HideIdentity,
	}

	authToken, err := s.tokenGenerator.Generate(me.ID, "auth", time.Now().Add(s.tokenDuration), claims)
	if err != nil {
		return nil, err
	}

	return &rpc.TokenAuthResponse{
		Token: authToken,
	}, nil
}

func (s *tokenService) PostMessage(ctx context.Context, r *rpc.TokenPostMessageRequest) (*rpc.TokenPostMessageResponse, error) {
	switch {
	case r.GroupId != "":
		return s.postMessageForGroup(ctx, r.GroupId)
	case r.FriendId != "":
		return s.postMessageForUser(ctx, r.FriendId)
	default:
		return s.postMessage(ctx)
	}
}

func (s *tokenService) postMessage(ctx context.Context) (*rpc.TokenPostMessageResponse, error) {
	me := s.getMe(ctx)

	hubs := s.repos.MessageHubs.ConnectedHubs(me)
	if len(hubs) == 0 {
		return &rpc.TokenPostMessageResponse{
			Tokens: nil,
		}, nil
	}

	hubs = hubs[:1]
	s.repos.MessageHubs.AssignUserToHub(me.ID, hubs[0].Hub.ID, hubs[0].MinDistance)

	friends := s.repos.Friend.Friends(me)
	friendIDs := make([]string, len(friends))
	for i, friend := range friends {
		friendIDs[i] = friend.ID
	}
	sort.Strings(friendIDs)

	tokens := make(map[string]string)
	exp := time.Now().Add(s.tokenDuration)
	for _, hub := range hubs {
		claims := map[string]interface{}{
			"hub":          hub.Hub.Address,
			"friends":      friendIDs,
			"is_guest_hub": hub.MinDistance == repo.GuestHubDistance,
		}
		hubToken, err := s.tokenGenerator.Generate(me.ID, "post-message", exp, claims)
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
	me := s.getMe(ctx)
	group, _ := s.getGroup(ctx, groupID)
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if !s.repos.Group.IsGroupMember(groupID, me.ID) {
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
		hubToken, err := s.tokenGenerator.Generate(me.ID, "post-message", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[adminHub] = hubToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens: tokens,
	}, nil
}

func (s *tokenService) postMessageForUser(ctx context.Context, friendID string) (*rpc.TokenPostMessageResponse, error) {
	me := s.getMe(ctx)
	user, isFriend := s.getUser(ctx, friendID)
	if user == nil || !isFriend {
		return nil, twirp.NotFoundError("user not found")
	}

	messageKey := s.repos.User.UsersKey(me.ID, user.ID)

	hubs := s.repos.MessageHubs.ConnectedHubs(me)
	tokens := make(map[string]string)
	if len(hubs) > 0 {
		hub := hubs[0]
		s.repos.MessageHubs.AssignUserToHub(me.ID, hub.Hub.ID, hub.MinDistance)

		exp := time.Now().Add(s.tokenDuration)
		claims := map[string]interface{}{
			"hub":       hub.Hub.Address,
			"friend_id": friendID,
		}
		hubToken, err := s.tokenGenerator.Generate(me.ID, "post-message", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[hub.Hub.Address] = hubToken
	}
	return &rpc.TokenPostMessageResponse{
		Tokens:     tokens,
		MessageKey: hex.EncodeToString(messageKey),
	}, nil
}

func (s *tokenService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.TokenGetMessagesResponse, error) {
	me := s.getMe(ctx)
	tokens := make(map[string]string)
	exp := time.Now().Add(s.tokenDuration)

	friends := s.repos.Friend.Friends(me)
	userIDs := make([]string, len(friends)+1)
	userIDs[0] = me.ID
	for i, u := range friends {
		userIDs[i+1] = u.ID
	}
	userHubs := s.repos.MessageHubs.UserHubs(userIDs)

	groupHubs := make(map[string][]string)
	userGroups := s.repos.Group.UserGroups(me.ID)
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

		hubToken, err := s.tokenGenerator.Generate(me.ID, "get-messages", exp, claims)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		tokens[hubAddress] = hubToken
	}
	return &rpc.TokenGetMessagesResponse{
		Tokens: tokens,
	}, nil
}
