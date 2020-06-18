package service

import (
	"context"

	"github.com/mreider/koto/backend/central/rpc"
)

type infoService struct {
	*BaseService
	pubKeyPem string
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
