package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/messagehub/rpc"
)

func NewAdmin(base *BaseService, destroy *bool) rpc.AdminService {
	return &adminService{
		BaseService: base,
		destroy:     destroy,
	}
}

type adminService struct {
	*BaseService
	destroy *bool
}

func (s *adminService) DestroyData(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	*s.destroy = true
	return &rpc.Empty{}, nil
}
