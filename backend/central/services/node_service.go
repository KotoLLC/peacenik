package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/rpc"
)

type nodeService struct {
	*BaseService
}

func NewNode(base *BaseService) rpc.NodeService {
	return &nodeService{
		BaseService: base,
	}
}

func (s *nodeService) Register(ctx context.Context, r *rpc.NodeRegisterRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	nodeExists, err := s.repos.Node.NodeExists(r.Address)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	if nodeExists {
		return nil, twirp.NewError(twirp.AlreadyExists, "node already exists")
	}
	err = s.repos.Node.AddNode(r.Address, user.Email)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *nodeService) PostMessages(ctx context.Context, _ *rpc.Empty) (*rpc.NodePostMessagesResponse, error) {
	user := s.getUser(ctx)

	nodes, err := s.repos.Node.PostMessagesNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.NodePostMessagesResponse{
		Nodes: nodes,
	}, nil
}

func (s *nodeService) GetMessages(ctx context.Context, _ *rpc.Empty) (*rpc.NodeGetMessagesResponse, error) {
	user := s.getUser(ctx)

	nodes, err := s.repos.Node.GetMessageNodes(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcNodes := make([]*rpc.NodeGetMessagesNode, len(nodes))
	for i, node := range nodes {
		rpcNodes[i] = &rpc.NodeGetMessagesNode{
			Address: node.Address,
			Users:   node.Users,
		}
	}

	return &rpc.NodeGetMessagesResponse{
		Nodes: rpcNodes,
	}, nil
}
