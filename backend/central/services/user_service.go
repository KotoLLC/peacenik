package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/rpc"
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
		rpcFriends[i] = &rpc.User{
			Id:   friend.ID,
			Name: friend.Name,
		}
	}

	return &rpc.UserFriendsResponse{
		Friends: rpcFriends,
	}, nil
}
