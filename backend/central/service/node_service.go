package service

import (
	"github.com/mreider/koto/backend/central/repo"
)

type NodeService interface {
	AddNode(address, adminEmail string) error
}

type nodeService struct {
	nodeRepo repo.NodeRepo
}

func NewNode(nodeRepo repo.NodeRepo) NodeService {
	return &nodeService{
		nodeRepo: nodeRepo,
	}
}

func (s *nodeService) AddNode(address, adminEmail string) error {
	nodeExists, err := s.nodeRepo.NodeExists(address)
	if err != nil {
		return err
	}
	if nodeExists {
		return ErrNodeAlreadyExists
	}
	return s.nodeRepo.AddNode(address, adminEmail)
}
