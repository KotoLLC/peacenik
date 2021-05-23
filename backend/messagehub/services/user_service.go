package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/messagehub/rpc"
)

func NewUser(base *BaseService) rpc.UserService {
	return &userService{
		BaseService: base,
	}
}

type userService struct {
	*BaseService
}

func (s *userService) BlockUser(ctx context.Context, r *rpc.UserBlockRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	s.repos.User.BlockUser(r.UserId)
	return &rpc.Empty{}, nil
}

func (s *userService) DeleteMe(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	s.repos.DeleteUserData(me.ID)
	return &rpc.Empty{}, nil
}
