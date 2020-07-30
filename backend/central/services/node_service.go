package services

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/common"
)

type nodeService struct {
	*BaseService
	admins []string
}

func NewNode(base *BaseService, admins []string) rpc.NodeService {
	return &nodeService{
		BaseService: base,
		admins:      admins,
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
	nodeID, err := s.repos.Node.AddNode(r.Address, r.Details, user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	for _, admin := range s.admins {
		adminUser, err := s.repos.User.FindUserByNameOrEmail(admin)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			log.Println(err)
		}
		if adminUser != nil {
			err = s.repos.Notification.AddNotification(adminUser.ID, user.Name+" added a new node", "node/add", map[string]interface{}{
				"user_id": user.ID,
				"node_id": nodeID,
			})
			if err != nil {
				log.Println(err)
			}
		}
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
		avatarThumbnailLink, err := s.createBlobLink(ctx, node.AdminAvatarID)
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
			CreatedAt:  common.TimeToRPCString(node.CreatedAt),
			ApprovedAt: common.NullTimeToRPCString(node.ApprovedAt),
			DisabledAt: common.NullTimeToRPCString(node.DisabledAt),
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
	user := s.getUser(ctx)

	err := s.repos.Node.ApproveNode(r.NodeId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	node, err := s.repos.Node.Node(r.NodeId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	err = s.repos.Notification.AddNotification(node.AdminID, user.Name+" approved your node", "node/approve", map[string]interface{}{
		"user_id": user.ID,
		"node_id": r.NodeId,
	})
	if err != nil {
		log.Println(err)
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

	if node.AdminID != user.ID {
		err = s.repos.Notification.AddNotification(node.AdminID, user.Name+" removed your node", "node/remove", map[string]interface{}{
			"user_id": user.ID,
			"node_id": r.NodeId,
		})
		if err != nil {
			log.Println(err)
		}
	}

	return &rpc.Empty{}, nil
}
