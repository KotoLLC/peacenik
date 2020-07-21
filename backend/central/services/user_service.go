package services

import (
	"bytes"
	"context"
	"log"
	"sort"

	"github.com/disintegration/imaging"
	"github.com/gofrs/uuid"
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
	friends, err := s.repos.Friend.Friends(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcFriends := make([]*rpc.User, len(friends))
	for i, friend := range friends {
		avatarThumbnailLink, err := s.createAvatarLink(ctx, friend.AvatarThumbnailID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcFriends[i] = &rpc.User{
			Id:              friend.ID,
			Name:            friend.Name,
			AvatarThumbnail: avatarThumbnailLink,
		}
	}

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

	others := make([]repo.User, 0, len(friendsOfFriends))
	for other := range friendsOfFriends {
		others = append(others, other)
	}
	inviteStatuses, err := s.repos.Invite.InviteStatuses(user, others)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for other, friends := range friendsOfFriends {
		rpcFriends := make([]*rpc.User, len(friends))
		for i, friend := range friends {
			avatarThumbnailLink, err := s.createAvatarLink(ctx, friend.AvatarThumbnailID)
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

		avatarThumbnailLink, err := s.createAvatarLink(ctx, other.AvatarThumbnailID)
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

	avatarThumbnailLink, err := s.createAvatarLink(ctx, user.AvatarThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.UserMeResponse{
		User: &rpc.User{
			Id:              user.ID,
			Name:            user.Name,
			AvatarThumbnail: avatarThumbnailLink,
			Email:           user.Email,
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

func (s *userService) setAvatar(ctx context.Context, user repo.User, avatarID string) error {
	if user.AvatarOriginalID == avatarID {
		return nil
	}

	defer func() {
		if user.AvatarOriginalID != "" {
			err := s.s3Storage.RemoveObject(ctx, user.AvatarOriginalID)
			if err != nil {
				log.Println(err)
			}
		}
		if user.AvatarThumbnailID != "" {
			err := s.s3Storage.RemoveObject(ctx, user.AvatarThumbnailID)
			if err != nil {
				log.Println(err)
			}
		}
	}()

	if avatarID == "" {
		err := s.repos.User.SetAvatar(user.ID, "", "")
		if err != nil {
			return twirp.InternalErrorWith(err)
		}
		return nil
	}

	var buf bytes.Buffer
	err := s.s3Storage.Read(ctx, avatarID, &buf)
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

	thumbnailID, err := uuid.NewV4()
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	err = s.s3Storage.PutObject(ctx, thumbnailID.String(), buf.Bytes(), "image/jpeg")
	if err != nil {
		return twirp.InternalErrorWith(err)
	}

	err = s.repos.User.SetAvatar(user.ID, avatarID, thumbnailID.String())
	if err != nil {
		return twirp.InternalErrorWith(err)
	}
	return nil
}
