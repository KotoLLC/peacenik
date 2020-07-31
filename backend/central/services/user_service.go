package services

import (
	"bytes"
	"context"
	"path/filepath"
	"sort"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/h2non/filetype"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
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
		return nil, twirp.InternalErrorWith(err)
	}

	inviteStatuses, err := s.repos.Invite.InviteStatuses(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcFriends := make([]*rpc.UserFriendsFriend, 0, len(friendMap))
	for friend, users := range friendMap {
		rpcUsers := make([]*rpc.UserFriendsFriendOfFriend, 0, len(users))
		for _, u := range users {
			if u.ID == user.ID {
				continue
			}

			avatarThumbnailLink, err := s.createBlobLink(ctx, u.AvatarThumbnailID)
			if err != nil {
				return nil, twirp.InternalErrorWith(err)
			}

			rpcUsers = append(rpcUsers, &rpc.UserFriendsFriendOfFriend{
				User: &rpc.User{
					Id:              u.ID,
					Name:            u.Name,
					AvatarThumbnail: avatarThumbnailLink,
				},
				InviteStatus: inviteStatuses[u.ID],
			})
		}

		sort.Slice(rpcUsers, func(i, j int) bool {
			return rpcUsers[i].User.Name < rpcUsers[j].User.Name
		})

		avatarThumbnailLink, err := s.createBlobLink(ctx, friend.AvatarThumbnailID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcFriends = append(rpcFriends, &rpc.UserFriendsFriend{
			User: &rpc.User{
				Id:              friend.ID,
				Name:            friend.Name,
				AvatarThumbnail: avatarThumbnailLink,
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
		return nil, twirp.InternalErrorWith(err)
	}

	inviteStatuses, err := s.repos.Invite.InviteStatuses(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for other, friends := range friendsOfFriends {
		rpcFriends := make([]*rpc.User, len(friends))
		for i, friend := range friends {
			avatarThumbnailLink, err := s.createBlobLink(ctx, friend.AvatarThumbnailID)
			if err != nil {
				return nil, twirp.InternalErrorWith(err)
			}

			rpcFriends[i] = &rpc.User{
				Id:              friend.ID,
				Name:            friend.Name,
				AvatarThumbnail: avatarThumbnailLink,
			}
		}

		sort.Slice(rpcFriends, func(i, j int) bool {
			return rpcFriends[i].Name < rpcFriends[j].Name
		})

		avatarThumbnailLink, err := s.createBlobLink(ctx, other.AvatarThumbnailID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		inviteStatus := inviteStatuses[other.ID]
		rpcFriendsOfFriends = append(rpcFriendsOfFriends, &rpc.UserFriendsOfFriendsResponseFriend{
			User: &rpc.User{
				Id:              other.ID,
				Name:            other.Name,
				AvatarThumbnail: avatarThumbnailLink,
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

	avatarThumbnailLink, err := s.createBlobLink(ctx, user.AvatarThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.UserMeResponse{
		User: &rpc.User{
			Id:              user.ID,
			Name:            user.Name,
			AvatarThumbnail: avatarThumbnailLink,
			Email:           user.Email,
			IsConfirmed:     user.ConfirmedAt.Valid,
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
				return nil, twirp.InternalErrorWith(err)
			}
		}
	}

	if r.PasswordChanged {
		if r.Password == "" {
			return nil, twirp.InvalidArgumentError("password", "is empty")
		}

		passwordHash, err := s.passwordHash.GenerateHash(r.Password)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		err = s.repos.User.SetPassword(user.ID, passwordHash)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
	}

	if r.AvatarChanged {
		err := s.setAvatar(ctx, user, r.AvatarId)
		if err != nil {
			return nil, err
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
			return twirp.InternalErrorWith(err)
		}
		return nil
	}

	var buf bytes.Buffer
	err = s.s3Storage.Read(ctx, avatarID, &buf)
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	dataType, err := filetype.Match(buf.Bytes())
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	if dataType.MIME.Type != "image" {
		return twirp.NewError(twirp.InvalidArgument, "not image")
	}

	original, err := imaging.Decode(&buf)
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	thumbnail := imaging.Thumbnail(original, avatarThumbnailWidth, avatarThumbnailHeight, imaging.Lanczos)
	buf.Reset()
	err = imaging.Encode(&buf, thumbnail, imaging.JPEG)
	if err != nil {
		return twirp.InternalErrorWith(err)
	}

	ext := filepath.Ext(avatarID)
	thumbnailID := strings.TrimSuffix(avatarID, ext) + "-thumbnail.jpg"
	err = s.s3Storage.PutObject(ctx, thumbnailID, buf.Bytes(), "image/jpeg")
	if err != nil {
		return twirp.InternalErrorWith(err)
	}

	err = s.repos.User.SetAvatar(user.ID, avatarID, thumbnailID)
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	return nil
}

func (s *userService) Users(ctx context.Context, r *rpc.UserUsersRequest) (*rpc.UserUsersResponse, error) {
	users, err := s.repos.User.FindUsers(r.UserIds)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	rpcUsers := make([]*rpc.User, len(users))
	for i, user := range users {
		avatarThumbnailLink, err := s.createBlobLink(ctx, user.AvatarThumbnailID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcUsers[i] = &rpc.User{
			Id:              user.ID,
			Name:            user.Name,
			AvatarThumbnail: avatarThumbnailLink,
		}
	}

	return &rpc.UserUsersResponse{
		Users: rpcUsers,
	}, nil
}
