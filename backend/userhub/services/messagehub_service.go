package services

import (
	"context"
	"database/sql"
	"log"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

type messageHubService struct {
	*BaseService
	admins []string
}

func NewMessageHub(base *BaseService, admins []string) rpc.MessageHubService {
	return &messageHubService{
		BaseService: base,
		admins:      admins,
	}
}

func (s *messageHubService) Register(ctx context.Context, r *rpc.MessageHubRegisterRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	r.Address = common.CleanPublicURL(r.Address)
	hubExists, err := s.repos.MessageHubs.HubExists(r.Address)
	if err != nil {
		return nil, err
	}
	if hubExists {
		return nil, twirp.NewError(twirp.AlreadyExists, "hub already exists")
	}
	hubID, err := s.repos.MessageHubs.AddHub(r.Address, r.Details, user, int(r.PostLimit))
	if err != nil {
		return nil, err
	}

	for _, admin := range s.admins {
		adminUser, err := s.repos.User.FindUserByNameOrEmail(admin)
		if err != nil && !merry.Is(err, sql.ErrNoRows) {
			log.Println(err)
		}
		if adminUser != nil {
			err = s.repos.Notification.AddNotification(adminUser.ID, user.Name+" added a new message hub", "message-hub/add", map[string]interface{}{
				"user_id": user.ID,
				"hub_id":  hubID,
			})
			if err != nil {
				log.Println(err)
			}
		}
	}
	return &rpc.Empty{}, nil
}

func (s *messageHubService) Hubs(ctx context.Context, _ *rpc.Empty) (*rpc.MessageHubHubsResponse, error) {
	user := s.getUser(ctx)

	var hubs []repo.MessageHub
	var err error
	if s.isAdmin(ctx) {
		hubs, err = s.repos.MessageHubs.AllHubs()
	} else {
		hubs, err = s.repos.MessageHubs.Hubs(user)
	}
	if err != nil {
		return nil, err
	}

	rpcHubs := make([]*rpc.MessageHubHubsResponseHub, len(hubs))
	for i, hub := range hubs {
		avatarThumbnailLink, err := s.createBlobLink(ctx, hub.AdminAvatarID)
		if err != nil {
			return nil, err
		}

		rpcHubs[i] = &rpc.MessageHubHubsResponseHub{
			Id:      hub.ID,
			Address: hub.Address,
			User: &rpc.User{
				Id:              hub.AdminID,
				Name:            hub.AdminName,
				AvatarThumbnail: avatarThumbnailLink,
			},
			CreatedAt:  common.TimeToRPCString(hub.CreatedAt),
			ApprovedAt: common.NullTimeToRPCString(hub.ApprovedAt),
			DisabledAt: common.NullTimeToRPCString(hub.DisabledAt),
			Details:    hub.Details,
			PostLimit:  int32(hub.PostLimit),
		}
	}

	return &rpc.MessageHubHubsResponse{
		Hubs: rpcHubs,
	}, nil
}

func (s *messageHubService) Approve(ctx context.Context, r *rpc.MessageHubApproveRequest) (*rpc.Empty, error) {
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	user := s.getUser(ctx)

	err := s.repos.MessageHubs.ApproveHub(r.HubId)
	if err != nil {
		return nil, err
	}

	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		return nil, err
	}

	err = s.repos.Notification.AddNotification(hub.AdminID, user.Name+" approved your message hub", "message-hub/approve", map[string]interface{}{
		"user_id": user.ID,
		"hub_id":  r.HubId,
	})
	if err != nil {
		log.Println(err)
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) Remove(ctx context.Context, r *rpc.MessageHubRemoveRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	if !s.isAdmin(ctx) && hub.AdminID != user.ID {
		return nil, twirp.NotFoundError(repo.ErrHubNotFound.Error())
	}

	err = s.repos.MessageHubs.RemoveHub(r.HubId)
	if err != nil {
		return nil, err
	}

	if hub.AdminID != user.ID {
		err = s.repos.Notification.AddNotification(hub.AdminID, user.Name+" removed your message hub", "message-hub/remove", map[string]interface{}{
			"user_id": user.ID,
			"hub_id":  r.HubId,
		})
		if err != nil {
			log.Println(err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) SetPostLimit(ctx context.Context, r *rpc.MessageHubSetPostLimitRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	if hub.AdminID != user.ID {
		return nil, twirp.NotFoundError(repo.ErrHubNotFound.Error())
	}

	err = s.repos.MessageHubs.SetHubPostLimit(user.ID, r.HubId, int(r.PostLimit))
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}
