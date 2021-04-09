package services

import (
	"context"
	"sort"
	"strings"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

const (
	avatarThumbnailWidth  = 100
	avatarThumbnailHeight = 100
)

func NewUser(base *BaseService, passwordHash PasswordHash) rpc.UserService {
	return &userService{
		BaseService:  base,
		passwordHash: passwordHash,
	}
}

type userService struct {
	*BaseService
	passwordHash PasswordHash
}

func (s *userService) Friends(ctx context.Context, _ *rpc.Empty) (*rpc.UserFriendsResponse, error) {
	me := s.getMe(ctx)
	friendMap := s.repos.Friend.FriendsWithSubFriends(me)
	inviteStatuses := s.repos.Invite.InviteStatuses(me)
	rpcFriends := make([]*rpc.UserFriendsFriend, 0, len(friendMap))
	for friend, users := range friendMap {
		rpcUsers := make([]*rpc.UserFriendsFriendOfFriend, 0, len(users))
		for _, u := range users {
			if u.ID == me.ID {
				continue
			}

			uInfo := s.userCache.User(u.ID, me.ID)
			rpcUsers = append(rpcUsers, &rpc.UserFriendsFriendOfFriend{
				User: &rpc.User{
					Id:           u.ID,
					Name:         uInfo.Name,
					FullName:     uInfo.FullName,
					HideIdentity: uInfo.HideIdentity,
				},
				InviteStatus: inviteStatuses[u.ID],
			})
		}

		sort.Slice(rpcUsers, func(i, j int) bool {
			return rpcUsers[i].User.Name < rpcUsers[j].User.Name
		})

		friendInfo := s.userCache.User(friend.ID, me.ID)
		rpcFriends = append(rpcFriends, &rpc.UserFriendsFriend{
			User: &rpc.User{
				Id:           friend.ID,
				Name:         friendInfo.Name,
				FullName:     friendInfo.FullName,
				HideIdentity: friendInfo.HideIdentity,
			},
			Friends:    rpcUsers,
			GroupCount: int32(s.repos.Group.UserGroupCount(friend.ID)),
		})
	}

	sort.Slice(rpcFriends, func(i, j int) bool {
		return rpcFriends[i].User.Name < rpcFriends[j].User.Name
	})

	return &rpc.UserFriendsResponse{
		Friends: rpcFriends,
	}, nil
}

func (s *userService) FriendsOfFriends(ctx context.Context, _ *rpc.Empty) (*rpc.UserFriendsOfFriendsResponse, error) {
	me := s.getMe(ctx)
	friendsOfFriends := s.repos.Friend.FriendsOfFriends(me)
	inviteStatuses := s.repos.Invite.InviteStatuses(me)
	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for other, friends := range friendsOfFriends {
		rpcFriends := make([]*rpc.User, len(friends))
		for i, friend := range friends {
			friendInfo := s.userCache.User(friend.ID, me.ID)
			rpcFriends[i] = &rpc.User{
				Id:           friend.ID,
				Name:         friendInfo.Name,
				FullName:     friendInfo.FullName,
				HideIdentity: friendInfo.HideIdentity,
			}
		}

		sort.Slice(rpcFriends, func(i, j int) bool {
			return rpcFriends[i].Name < rpcFriends[j].Name
		})

		inviteStatus := inviteStatuses[other.ID]
		otherInfo := s.userCache.User(other.ID, me.ID)
		rpcFriendsOfFriends = append(rpcFriendsOfFriends, &rpc.UserFriendsOfFriendsResponseFriend{
			User: &rpc.User{
				Id:           other.ID,
				Name:         otherInfo.Name,
				FullName:     otherInfo.FullName,
				HideIdentity: otherInfo.HideIdentity,
			},
			InviteStatus: inviteStatus,
			Friends:      rpcFriends,
		})
	}

	sort.Slice(rpcFriendsOfFriends, func(i, j int) bool {
		return rpcFriendsOfFriends[i].User.Name < rpcFriendsOfFriends[j].User.Name
	})

	return &rpc.UserFriendsOfFriendsResponse{
		Friends: rpcFriendsOfFriends,
	}, nil
}

func (s *userService) Me(ctx context.Context, _ *rpc.Empty) (*rpc.UserMeResponse, error) {
	me := s.getMe(ctx)
	isAdmin := s.isAdmin(ctx)

	ownedHubs := s.repos.MessageHubs.Hubs(me)

	ownedHubAddresses := make([]string, len(ownedHubs))
	for i, hub := range ownedHubs {
		ownedHubAddresses[i] = hub.Address
	}

	groups := s.repos.Group.UserGroups(me.ID)
	rpcGroups := make([]*rpc.Group, len(groups))
	for i, group := range groups {
		adminInfo := s.userCache.User(group.AdminID, me.ID)
		rpcGroups[i] = &rpc.Group{
			Id:          group.ID,
			Name:        group.Name,
			Description: group.Description,
			IsPublic:    group.IsPublic,
			MemberCount: int32(group.MemberCount),
			Admin: &rpc.User{
				Id:           group.AdminID,
				Name:         adminInfo.Name,
				FullName:     adminInfo.FullName,
				HideIdentity: adminInfo.HideIdentity,
			},
		}
	}

	meInfo := s.userCache.UserFullAccess(me.ID)
	return &rpc.UserMeResponse{
		User: &rpc.User{
			Id:           me.ID,
			Name:         meInfo.Name,
			Email:        meInfo.Email,
			FullName:     meInfo.FullName,
			IsConfirmed:  me.ConfirmedAt.Valid,
			HideIdentity: meInfo.HideIdentity,
		},
		IsAdmin:   isAdmin,
		OwnedHubs: ownedHubAddresses,
		Groups:    rpcGroups,
	}, nil
}

func (s *userService) EditProfile(ctx context.Context, r *rpc.UserEditProfileRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)

	if r.EmailChanged {
		if r.Email == "" {
			return nil, twirp.InvalidArgumentError("email", "is empty")
		}
		meInfo := s.userCache.UserFullAccess(me.ID)
		if r.Email != meInfo.Email {
			s.repos.User.SetEmail(me.ID, r.Email)
		}
	}

	if r.PasswordChanged {
		if r.NewPassword == "" {
			return nil, twirp.InvalidArgumentError("password", "is empty")
		}

		if !s.passwordHash.CompareHashAndPassword(me.PasswordHash, r.CurrentPassword) {
			return nil, twirp.NewError(twirp.InvalidArgument, "invalid password")
		}

		newPasswordHash, err := s.passwordHash.GenerateHash(r.NewPassword)
		if err != nil {
			return nil, err
		}

		s.repos.User.SetPassword(me.ID, newPasswordHash)
	}

	if r.AvatarChanged {
		err := s.setAvatar(ctx, me, r.AvatarId)
		if err != nil {
			return nil, merry.Wrap(err)
		}
	}

	if r.FullNameChanged {
		fullName := strings.Join(strings.Fields(r.FullName), " ")
		s.repos.User.SetFullName(me.ID, fullName)
	}

	if r.BackgroundChanged {
		s.repos.User.SetBackground(me.ID, r.BackgroundId)
	}

	if r.HideIdentityChanged {
		s.repos.User.SetHideIdentity(me.ID, r.HideIdentity)
	}

	return &rpc.Empty{}, nil
}

func (s *userService) setAvatar(ctx context.Context, user repo.User, avatarID string) (err error) {
	userInfo := s.userCache.UserFullAccess(user.ID)
	if userInfo.AvatarOriginalID == avatarID {
		return nil
	}

	if avatarID == "" {
		s.repos.User.SetAvatar(user.ID, "", "")
		return nil
	}

	thumbnailID, err := s.saveThumbnail(ctx, avatarID)
	if err != nil {
		return merry.Wrap(err)
	}

	s.repos.User.SetAvatar(user.ID, avatarID, thumbnailID)
	return nil
}

func (s *userService) Users(ctx context.Context, r *rpc.UserUsersRequest) (*rpc.UserUsersResponse, error) {
	me := s.getMe(ctx)
	users := s.repos.User.FindUsers(r.UserIds)
	inviteStatuses := s.repos.Invite.InviteStatuses(me)

	rpcUsers := make([]*rpc.User, len(users))
	rpcInviteStatuses := make([]string, len(users))
	for i, user := range users {
		userInfo := s.userCache.User(user.ID, me.ID)
		rpcUsers[i] = &rpc.User{
			Id:           user.ID,
			Name:         userInfo.Name,
			FullName:     userInfo.FullName,
			HideIdentity: userInfo.HideIdentity,
		}
		rpcInviteStatuses[i] = inviteStatuses[user.ID]
	}

	return &rpc.UserUsersResponse{
		Users:          rpcUsers,
		InviteStatuses: rpcInviteStatuses,
	}, nil
}

func (s *userService) User(ctx context.Context, r *rpc.UserUserRequest) (*rpc.UserUserResponse, error) {
	me := s.getMe(ctx)

	if r.UserId == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "user_id should be specified")
	}
	user := s.repos.User.FindUserByID(r.UserId)
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	userInfo := s.userCache.User(user.ID, me.ID)
	rpcUser := &rpc.User{
		Id:           user.ID,
		Name:         userInfo.Name,
		FullName:     userInfo.FullName,
		IsConfirmed:  user.ConfirmedAt.Valid,
		HideIdentity: userInfo.HideIdentity,
	}
	inviteStatuses := s.repos.Invite.InviteStatuses(me)

	return &rpc.UserUserResponse{
		User:         rpcUser,
		InviteStatus: inviteStatuses[user.ID],
	}, nil
}

func (s *userService) RegisterFCMToken(ctx context.Context, r *rpc.UserRegisterFCMTokenRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)

	if r.Token == "" {
		return nil, twirp.InvalidArgumentError("token", "is empty")
	}
	if r.Os == "" {
		return nil, twirp.InvalidArgumentError("os", "is empty")
	}

	s.repos.FCMToken.AddToken(me.ID, r.Token, r.DeviceId, r.Os)
	return &rpc.Empty{}, nil
}

func (s *userService) BlockUser(ctx context.Context, r *rpc.UserBlockUserRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if me.ID == r.UserId || r.UserId == "" {
		return nil, twirp.InvalidArgumentError("user_id", "is invalid")
	}

	s.repos.User.BlockUser(me.ID, r.UserId)

	return &rpc.Empty{}, nil
}

func (s *userService) DeleteMe(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	s.repos.DeleteUserData(me.ID)
	return &rpc.Empty{}, nil
}
