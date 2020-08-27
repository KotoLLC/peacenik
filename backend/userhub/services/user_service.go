package services

import (
	"bytes"
	"context"
	"path/filepath"
	"sort"
	"strings"

	"github.com/ansel1/merry"
	"github.com/disintegration/imaging"
	"github.com/h2non/filetype"
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
	friendMap, err := s.repos.Friend.FriendsWithSubFriends(user)
	if err != nil {
		return nil, err
	}

	inviteStatuses, err := s.repos.Invite.InviteStatuses(user)
	if err != nil {
		return nil, err
	}

	rpcFriends := make([]*rpc.UserFriendsFriend, 0, len(friendMap))
	for friend, users := range friendMap {
		rpcUsers := make([]*rpc.UserFriendsFriendOfFriend, 0, len(users))
		for _, u := range users {
			if u.ID == user.ID {
				continue
			}

			rpcUsers = append(rpcUsers, &rpc.UserFriendsFriendOfFriend{
				User: &rpc.User{
					Id:   u.ID,
					Name: u.Name,
				},
				InviteStatus: inviteStatuses[u.ID],
			})
		}

		sort.Slice(rpcUsers, func(i, j int) bool {
			return rpcUsers[i].User.Name < rpcUsers[j].User.Name
		})

		rpcFriends = append(rpcFriends, &rpc.UserFriendsFriend{
			User: &rpc.User{
				Id:   friend.ID,
				Name: friend.Name,
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
	friendsOfFriends, err := s.repos.Friend.FriendsOfFriends(user)
	if err != nil {
		return nil, err
	}

	inviteStatuses, err := s.repos.Invite.InviteStatuses(user)
	if err != nil {
		return nil, err
	}

	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for other, friends := range friendsOfFriends {
		rpcFriends := make([]*rpc.User, len(friends))
		for i, friend := range friends {
			rpcFriends[i] = &rpc.User{
				Id:   friend.ID,
				Name: friend.Name,
			}
		}

		sort.Slice(rpcFriends, func(i, j int) bool {
			return rpcFriends[i].Name < rpcFriends[j].Name
		})

		inviteStatus := inviteStatuses[other.ID]
		rpcFriendsOfFriends = append(rpcFriendsOfFriends, &rpc.UserFriendsOfFriendsResponseFriend{
			User: &rpc.User{
				Id:   other.ID,
				Name: other.Name,
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

	return &rpc.UserMeResponse{
		User: &rpc.User{
			Id:          user.ID,
			Name:        user.Name,
			Email:       user.Email,
			IsConfirmed: user.ConfirmedAt.Valid,
		},
		IsAdmin: isAdmin,
	}, nil
}

func (s *userService) EditProfile(ctx context.Context, r *rpc.UserEditProfileRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.EmailChanged {
		if r.Email == "" {
			return nil, twirp.InvalidArgumentError("email", "is empty")
		}
		if r.Email != user.Email {
			err := s.repos.User.SetEmail(user.ID, r.Email)
			if err != nil {
				return nil, err
			}
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

		err = s.repos.User.SetPassword(user.ID, newPasswordHash)
		if err != nil {
			return nil, err
		}
	}

	if r.AvatarChanged {
		err := s.setAvatar(ctx, user, r.AvatarId)
		if err != nil {
			return nil, merry.Wrap(err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *userService) setAvatar(ctx context.Context, user repo.User, avatarID string) (err error) {
	if user.AvatarOriginalID == avatarID {
		return nil
	}

	if avatarID == "" {
		err := s.repos.User.SetAvatar(user.ID, "", "")
		if err != nil {
			return merry.Wrap(err)
		}
		return nil
	}

	var buf bytes.Buffer
	err = s.s3Storage.Read(ctx, avatarID, &buf)
	if err != nil {
		return merry.Wrap(err)
	}
	dataType, err := filetype.Match(buf.Bytes())
	if err != nil {
		return merry.Wrap(err)
	}
	if dataType.MIME.Type != "image" {
		return twirp.NewError(twirp.InvalidArgument, "not image")
	}

	original, err := imaging.Decode(&buf)
	if err != nil {
		return merry.Wrap(err)
	}
	thumbnail := imaging.Thumbnail(original, avatarThumbnailWidth, avatarThumbnailHeight, imaging.Lanczos)
	buf.Reset()
	err = imaging.Encode(&buf, thumbnail, imaging.JPEG)
	if err != nil {
		return merry.Wrap(err)
	}

	ext := filepath.Ext(avatarID)
	thumbnailID := strings.TrimSuffix(avatarID, ext) + "-thumbnail.jpg"
	err = s.s3Storage.PutObject(ctx, thumbnailID, buf.Bytes(), "image/jpeg")
	if err != nil {
		return merry.Wrap(err)
	}

	err = s.repos.User.SetAvatar(user.ID, avatarID, thumbnailID)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (s *userService) Users(_ context.Context, r *rpc.UserUsersRequest) (*rpc.UserUsersResponse, error) {
	users, err := s.repos.User.FindUsers(r.UserIds)
	if err != nil {
		return nil, err
	}
	rpcUsers := make([]*rpc.User, len(users))
	for i, user := range users {
		rpcUsers[i] = &rpc.User{
			Id:   user.ID,
			Name: user.Name,
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
		var err error
		user, err = s.repos.User.FindUserByID(r.UserId)
		if err != nil {
			return nil, err
		}
	} else {
		var err error
		user, err = s.repos.User.FindUserByName(r.UserName)
		if err != nil {
			return nil, err
		}
	}
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	rpcUser := &rpc.User{
		Id:          user.ID,
		Name:        user.Name,
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

	err := s.repos.FCMToken.AddToken(user.ID, r.Token, r.DeviceId, r.Os)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}
