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
}

func NewUser(base *BaseService) rpc.UserService {
	return &userService{
		BaseService: base,
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
			Name:            user.Email,
			AvatarThumbnail: avatarThumbnailLink,
		},
		IsAdmin: isAdmin,
	}, nil
}

func (s *userService) SetAvatar(ctx context.Context, r *rpc.UserSetAvatarRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if user.AvatarOriginalID == r.AvatarId {
		return &rpc.Empty{}, nil
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

	if r.AvatarId == "" {
		err := s.repos.User.SetAvatar(user.ID, "", "")
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
		return &rpc.Empty{}, nil
	}

	var buf bytes.Buffer
	err := s.s3Storage.Read(ctx, r.AvatarId, &buf)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	dataType, err := filetype.Match(buf.Bytes())
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	if dataType.MIME.Type != "image" {
		return nil, twirp.NewError(twirp.InvalidArgument, "not image")
	}

	original, err := imaging.Decode(&buf)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	thumbnail := imaging.Thumbnail(original, avatarThumbnailWidth, avatarThumbnailHeight, imaging.Lanczos)
	buf.Reset()
	err = imaging.Encode(&buf, thumbnail, imaging.JPEG)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	thumbnailID, err := uuid.NewV4()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	err = s.s3Storage.PutObject(ctx, thumbnailID.String(), buf.Bytes(), "image/jpeg")
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	err = s.repos.User.SetAvatar(user.ID, r.AvatarId, thumbnailID.String())
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}
