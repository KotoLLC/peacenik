package services

import (
	"context"
	"encoding/json"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/userhub/rpc"
)

func NewMessageHubInternal(base *BaseService) rpc.MessageHubInternalService {
	return &messageHubInternalService{
		BaseService: base,
	}
}

type messageHubInternalService struct {
	*BaseService
}

func (s *messageHubInternalService) PostNotifications(_ context.Context, r *rpc.MessageHubInternalPostNotificationsRequest) (*rpc.Empty, error) {
	var notifications []Notification
	err := json.Unmarshal([]byte(r.Notifications), &notifications)
	if err != nil {
		return nil, err
	}

	for i, notification := range notifications {
		notification.IsExternal = true
		notifications[i] = notification
	}
	s.notificationSender.SendExternalNotifications(notifications)
	return &rpc.Empty{}, nil
}

func (s *messageHubInternalService) ExpirationDays(ctx context.Context, _ *rpc.Empty) (*rpc.MessageHubInternalExpirationDaysResponse, error) {
	hubAddress := s.getHubAddress(ctx)
	hub := s.repos.MessageHubs.HubByIDOrAddress(hubAddress)
	if hub == nil {
		return nil, twirp.NotFoundError("hub not found")
	}
	return &rpc.MessageHubInternalExpirationDaysResponse{
		ExpirationDays: int32(hub.ExpirationDays),
	}, nil
}
