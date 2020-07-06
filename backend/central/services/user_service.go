package services

import (
	"context"
	"sort"

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

func (s *userService) FriendsOfFriends(ctx context.Context, _ *rpc.Empty) (*rpc.UserFriendsOfFriendsResponse, error) {
	user := s.getUser(ctx)
	friendsOfFriends, err := s.repos.Friend.FriendsOfFriends(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcFriendsOfFriends := make([]*rpc.UserFriendsOfFriendsResponseFriend, 0, len(friendsOfFriends))
	for user, friends := range friendsOfFriends {
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

		rpcFriendsOfFriends = append(rpcFriendsOfFriends, &rpc.UserFriendsOfFriendsResponseFriend{
			User: &rpc.User{
				Id:   user.ID,
				Name: user.Name,
			},
			Friends: rpcFriends,
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
			Id:   user.ID,
			Name: user.Email,
		},
		IsAdmin: isAdmin,
	}, nil
}
