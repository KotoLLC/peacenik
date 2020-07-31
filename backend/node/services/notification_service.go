package services

import (
	"context"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node/rpc"
)

type notificationService struct {
	*BaseService
}

func NewNotification(base *BaseService) rpc.NotificationService {
	return &notificationService{
		BaseService: base,
	}
}

func (s *notificationService) Count(ctx context.Context, _ *rpc.Empty) (*rpc.NotificationCountResponse, error) {
	user := s.getUser(ctx)
	total, unread, err := s.repos.Notification.Counts(user.ID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.NotificationCountResponse{
		Total:  int32(total),
		Unread: int32(unread),
	}, nil
}

func (s *notificationService) Notifications(ctx context.Context, _ *rpc.Empty) (*rpc.NotificationNotificationsResponse, error) {
	user := s.getUser(ctx)
	notifications, err := s.repos.Notification.Notifications(user.ID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	rpcNotifications := make([]*rpc.Notification, len(notifications))
	for i, notification := range notifications {
		rpcNotifications[i] = &rpc.Notification{
			Id:        notification.ID,
			Text:      notification.Text,
			Type:      notification.Type,
			Data:      notification.Data.String(),
			CreatedAt: common.TimeToRPCString(notification.CreatedAt),
			ReadAt:    common.NullTimeToRPCString(notification.ReadAt),
		}
	}

	return &rpc.NotificationNotificationsResponse{
		Notifications: rpcNotifications,
	}, nil
}

func (s *notificationService) Clean(ctx context.Context, r *rpc.NotificationCleanRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Notification.Clean(user.ID, r.LastKnownId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}
