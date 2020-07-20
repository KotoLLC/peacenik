package services

import (
	"context"
	"errors"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
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
	err = s.repos.Node.AddNode(r.Address, r.Details, user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *nodeService) Nodes(ctx context.Context, _ *rpc.Empty) (*rpc.NodeNodesResponse, error) {
	user := s.getUser(ctx)

	var nodes []repo.Node
	var err error
	if s.isAdmin(ctx) {
		nodes, err = s.repos.Node.AllNodes()
	} else {
		nodes, err = s.repos.Node.Nodes(user)
	}
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcNodes := make([]*rpc.NodeNodesResponseNode, len(nodes))
	for i, node := range nodes {
		avatarThumbnailLink, err := s.createAvatarLink(ctx, node.AdminAvatarID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcNodes[i] = &rpc.NodeNodesResponseNode{
			Id:      node.ID,
			Address: node.Address,
			User: &rpc.User{
				Id:              node.AdminID,
				Name:            node.AdminName,
				AvatarThumbnail: avatarThumbnailLink,
			},
			CreatedAt:  node.CreatedAt,
			ApprovedAt: node.ApprovedAt,
			DisabledAt: node.DisabledAt,
			Details:    node.Details,
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

func (s *nodeService) Remove(ctx context.Context, r *rpc.NodeRemoveRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	node, err := s.repos.Node.Node(r.NodeId)
	if err != nil {
		if errors.Is(err, repo.ErrNodeNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}

	if !s.isAdmin(ctx) && node.AdminID != user.ID {
		return nil, twirp.NotFoundError(repo.ErrNodeNotFound.Error())
	}

	err = s.repos.Node.RemoveNode(r.NodeId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.Empty{}, nil
}
