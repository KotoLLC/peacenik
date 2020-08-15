package services

import (
	"context"
	"log"
	"sync"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/messagehub/rpc"
)

type infoService struct {
	*BaseService

	dockerOnce    sync.Once
	dockerCreated string
}

func NewInfo(base *BaseService) rpc.InfoService {
	return &infoService{
		BaseService: base,
	}
}

func (s *infoService) Version(_ context.Context, _ *rpc.Empty) (*rpc.InfoVersionResponse, error) {
	s.dockerOnce.Do(func() {
		container, err := common.CurrentContainer(context.Background())
		if err != nil {
			log.Println("can't get docker info:", err)
		}
		if container != nil {
			s.dockerCreated = container.ImageCreated()
		}
	})

	return &rpc.InfoVersionResponse{
		DockerUpdated: s.dockerCreated,
	}, nil
}
