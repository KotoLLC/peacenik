package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/messagehub/rpc"
)

type userService struct {
	*BaseService
}

func NewUser(base *BaseService) rpc.UserService {
	return &userService{
		BaseService: base,
	}
}

func (s *userService) BlockUser(ctx context.Context, r *rpc.UserBlockRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if !user.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	err := s.repos.User.BlockUser(r.UserId)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}
