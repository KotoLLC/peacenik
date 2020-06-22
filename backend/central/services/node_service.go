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
	err = s.repos.Node.AddNode(r.Address, user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *nodeService) Nodes(ctx context.Context, _ *rpc.Empty) (*rpc.NodeNodesResponse, error) {
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	nodes, err := s.repos.Node.Nodes()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcNodes := make([]*rpc.NodeNodesResponseNode, len(nodes))
	for i, node := range nodes {
		rpcNodes[i] = &rpc.NodeNodesResponseNode{
			Id:      node.ID,
			Address: node.Address,
			User: &rpc.User{
				Id:   node.AdminID,
				Name: node.AdminName,
			},
			CreatedAt:  node.CreatedAt,
			ApprovedAt: node.ApprovedAt,
			DisabledAt: node.DisabledAt,
		}
	}

	return &rpc.NodeNodesResponse{
		Nodes: rpcNodes,
	}, nil
}

func (s *nodeService) Approve(ctx context.Context, r *rpc.NodeApproveRequest) (*rpc.Empty, error) {
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	err := s.repos.Node.ApproveNode(r.NodeId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.Empty{}, nil
}
