package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/messagehub/rpc"
)

func NewAdmin(base *BaseService, destroy chan<- struct{}) rpc.AdminService {
	return &adminService{
		BaseService: base,
		destroy:     destroy,
	}
}

type adminService struct {
	*BaseService
	destroy chan<- struct{}
}

func (s *adminService) DestroyData(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if !user.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	s.destroy <- struct{}{}
	return &rpc.Empty{}, nil
}
