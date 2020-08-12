package services

import (
	"context"
	"log"
	"sync"

	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/common"
)

type infoService struct {
	*BaseService
	pubKeyPem string

	dockerOnce sync.Once
	dockerTag  string
}

func NewInfo(base *BaseService, pubKeyPem string) rpc.InfoService {
	return &infoService{
		BaseService: base,
		pubKeyPem:   pubKeyPem,
	}
}

func (s *infoService) PublicKey(_ context.Context, _ *rpc.Empty) (*rpc.InfoPublicKeyResponse, error) {
	return &rpc.InfoPublicKeyResponse{
		PublicKey: s.pubKeyPem,
	}, nil
}

func (s *infoService) Version(_ context.Context, _ *rpc.Empty) (*rpc.InfoVersionResponse, error) {
	s.dockerOnce.Do(func() {
		container, err := common.CurrentContainer(context.Background())
		if err != nil {
			log.Println("can't get docker tags:", err)
		}
		if container != nil {
			dockerTags := container.ImageTags()
			if len(dockerTags) > 0 {
				s.dockerTag = dockerTags[0]
			}
		}
	})

	return &rpc.InfoVersionResponse{
		DockerTag: s.dockerTag,
	}, nil
}
