package services

import (
	"context"
	"errors"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/rpc"
	"github.com/mreider/koto/backend/token"
)

type messageService struct {
	*BaseService
}

func NewMessage(base *BaseService) rpc.MessageService {
	return &messageService{
		BaseService: base,
	}
}

func (s *messageService) Post(ctx context.Context, r *rpc.MessagePostRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	_, claims, err := s.tokenParser.Parse(r.Token, "post-message")
	if err != nil {
		if errors.Is(err, token.ErrInvalidToken) {
			return nil, twirp.NewError(twirp.InvalidArgument, "invalid token")
		}
		return nil, twirp.InternalErrorWith(err)
	}

	if user.ID != claims["id"].(string) || s.externalAddress != claims["node"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid token")
	}

	err = s.repos.Message.AddMessage(repo.Message{
		ID:        r.Message.Id,
		UserID:    claims["id"].(string),
		UserName:  claims["name"].(string),
		Text:      r.Message.Text,
		CreatedAt: r.Message.CreatedAt,
		UpdatedAt: r.Message.UpdatedAt,
	})
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.Empty{}, nil
}

func (s *messageService) Messages(ctx context.Context, r *rpc.MessageMessagesRequest) (*rpc.MessageMessagesResponse, error) {
	user := s.getUser(ctx)

	_, claims, err := s.tokenParser.Parse(r.Token, "get-messages")
	if err != nil {
		if errors.Is(err, token.ErrInvalidToken) {
			return nil, twirp.NewError(twirp.InvalidArgument, "invalid token")
		}
		return nil, twirp.InternalErrorWith(err)
	}

	if user.ID != claims["id"].(string) || s.externalAddress != claims["node"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid token")
	}

	rawUserIDs := claims["users"].([]interface{})
	userIDs := make([]string, len(rawUserIDs))
	for i, rawUserID := range rawUserIDs {
		userIDs[i] = rawUserID.(string)
	}
	messages, err := s.repos.Message.Messages(userIDs)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	rpcMessages := make([]*rpc.Message, len(messages))
	for i, message := range messages {
		rpcMessages[i] = &rpc.Message{
			Id:        message.ID,
			UserId:    message.UserID,
			UserName:  message.UserName,
			Text:      message.Text,
			CreatedAt: message.CreatedAt,
			UpdatedAt: message.UpdatedAt,
		}
	}

	return &rpc.MessageMessagesResponse{
		Messages: rpcMessages,
	}, nil
}

func (s *messageService) Edit(ctx context.Context, r *rpc.MessageEditRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Message.EditMessage(user.ID, r.MessageId, r.Text, r.UpdatedAt)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) Delete(ctx context.Context, r *rpc.MessageDeleteRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Message.DeleteMessage(user.ID, r.MessageId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}
