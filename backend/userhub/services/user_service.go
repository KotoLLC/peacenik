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

type userService struct {
	*BaseService
	passwordHash PasswordHash
}

func NewUser(base *BaseService, passwordHash PasswordHash) rpc.UserService {
	return &userService{
		BaseService:  base,
		passwordHash: passwordHash,
	}
}

func (s *userService) Friends(ctx context.Context, _ *rpc.Empty) (*rpc.UserFriendsResponse, error) {
	user := s.getUser(ctx)
	friendMap := s.repos.Friend.FriendsWithSubFriends(user)
	inviteStatuses := s.repos.Invite.InviteStatuses(user)
	rpcFriends := make([]*rpc.UserFriendsFriend, 0, len(friendMap))
	for friend, users := range friendMap {
		rpcUsers := make([]*rpc.UserFriendsFriendOfFriend, 0, len(users))
		for _, u := range users {
			if u.ID == user.ID {
				continue
			}

			rpcUsers = append(rpcUsers, &rpc.UserFriendsFriendOfFriend{
				User: &rpc.User{
					Id:       u.ID,
					Name:     u.Name,
					FullName: u.FullName,
				},
				InviteStatus: inviteStatuses[u.ID],
			})
		}

		sort.Slice(rpcUsers, func(i, j int) bool {
			return rpcUsers[i].User.Name < rpcUsers[j].User.Name
		})

		rpcFriends = append(rpcFriends, &rpc.UserFriendsFriend{
			User: &rpc.User{
				Id:       friend.ID,
				Name:     friend.Name,
				FullName: friend.FullName,
			},
			Friends: rpcUsers,
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
	user := s.getUser(ctx)
	friendsOfFriends := s.repos.Friend.FriendsOfFriends(user)
	inviteStatuses := s.repos.Invite.InviteStatuses(user)
	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for other, friends := range friendsOfFriends {
		rpcFriends := make([]*rpc.User, len(friends))
		for i, friend := range friends {
			rpcFriends[i] = &rpc.User{
				Id:       friend.ID,
				Name:     friend.Name,
				FullName: friend.FullName,
			}
		}

		sort.Slice(rpcFriends, func(i, j int) bool {
			return rpcFriends[i].Name < rpcFriends[j].Name
		})

		inviteStatus := inviteStatuses[other.ID]
		rpcFriendsOfFriends = append(rpcFriendsOfFriends, &rpc.UserFriendsOfFriendsResponseFriend{
			User: &rpc.User{
				Id:       other.ID,
				Name:     other.Name,
				FullName: other.FullName,
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
	user := s.getUser(ctx)
	isAdmin := s.isAdmin(ctx)

	ownedHubs := s.repos.MessageHubs.Hubs(user)

	ownedHubAddresses := make([]string, len(ownedHubs))
	for i, hub := range ownedHubs {
		ownedHubAddresses[i] = hub.Address
	}

	return &rpc.UserMeResponse{
		User: &rpc.User{
			Id:          user.ID,
			Name:        user.Name,
			Email:       user.Email,
			FullName:    user.FullName,
			IsConfirmed: user.ConfirmedAt.Valid,
		},
		IsAdmin:   isAdmin,
		OwnedHubs: ownedHubAddresses,
	}, nil
}

func (s *userService) EditProfile(ctx context.Context, r *rpc.UserEditProfileRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.EmailChanged {
		if r.Email == "" {
			return nil, twirp.InvalidArgumentError("email", "is empty")
		}
		if r.Email != user.Email {
			s.repos.User.SetEmail(user.ID, r.Email)
		}
	}

	if r.PasswordChanged {
		if r.NewPassword == "" {
			return nil, twirp.InvalidArgumentError("password", "is empty")
		}

		if !s.passwordHash.CompareHashAndPassword(user.PasswordHash, r.CurrentPassword) {
			return nil, twirp.NewError(twirp.InvalidArgument, "invalid password")
		}

		newPasswordHash, err := s.passwordHash.GenerateHash(r.NewPassword)
		if err != nil {
			return nil, err
		}

		s.repos.User.SetPassword(user.ID, newPasswordHash)
	}

	if r.AvatarChanged {
		err := s.setAvatar(ctx, user, r.AvatarId)
		if err != nil {
			return nil, merry.Wrap(err)
		}
	}

	if r.FullNameChanged {
		fullName := strings.Join(strings.Fields(r.FullName), " ")
		s.repos.User.SetFullName(user.ID, fullName)
	}

	return &rpc.Empty{}, nil
}

func (s *userService) setAvatar(ctx context.Context, user repo.User, avatarID string) (err error) {
	if user.AvatarOriginalID == avatarID {
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

func (s *userService) Users(_ context.Context, r *rpc.UserUsersRequest) (*rpc.UserUsersResponse, error) {
	users := s.repos.User.FindUsers(r.UserIds)
	rpcUsers := make([]*rpc.User, len(users))
	for i, user := range users {
		rpcUsers[i] = &rpc.User{
			Id:       user.ID,
			Name:     user.Name,
			FullName: user.FullName,
		}
	}

	return &rpc.UserUsersResponse{
		Users: rpcUsers,
	}, nil
}

func (s *userService) User(_ context.Context, r *rpc.UserUserRequest) (*rpc.UserUserResponse, error) {
	if r.UserId == "" && r.UserName == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "user_id or user_name should be specified")
	}
	if r.UserId != "" && r.UserName != "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "one of user_id and user_name should be specified")
	}
	var user *repo.User
	if r.UserId != "" {
		user = s.repos.User.FindUserByID(r.UserId)
	} else {
		user = s.repos.User.FindUserByName(r.UserName)
	}
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	rpcUser := &rpc.User{
		Id:          user.ID,
		Name:        user.Name,
		FullName:    user.FullName,
		IsConfirmed: user.ConfirmedAt.Valid,
	}
	return &rpc.UserUserResponse{
		User: rpcUser,
	}, nil
}

func (s *userService) RegisterFCMToken(ctx context.Context, r *rpc.UserRegisterFCMTokenRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.Token == "" {
		return nil, twirp.InvalidArgumentError("token", "is empty")
	}
	if r.Os == "" {
		return nil, twirp.InvalidArgumentError("os", "is empty")
	}

	s.repos.FCMToken.AddToken(user.ID, r.Token, r.DeviceId, r.Os)
	return &rpc.Empty{}, nil
}

func (s *userService) BlockUser(ctx context.Context, r *rpc.UserBlockUserRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if user.ID == r.UserId || r.UserId == "" {
		return nil, twirp.InvalidArgumentError("user_id", "is invalid")
	}

	s.repos.User.BlockUser(user.ID, r.UserId)

	return &rpc.Empty{}, nil
}
