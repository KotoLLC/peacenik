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
	pubKeyPem string

	dockerOnce    sync.Once
	dockerCreated string
}

func NewInfo(base *BaseService, pubKeyPem string) rpc.InfoService {
	return &infoService{
		BaseService: base,
		pubKeyPem:   pubKeyPem,
	}
}

func (s *infoService) PublicKey(context.Context, *rpc.Empty) (*rpc.InfoPublicKeyResponse, error) {
	return &rpc.InfoPublicKeyResponse{
		PublicKey: s.pubKeyPem,
	}, nil
}

func (s *infoService) Version(context.Context, *rpc.Empty) (*rpc.InfoVersionResponse, error) {
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
