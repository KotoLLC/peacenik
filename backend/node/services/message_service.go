package services

import (
	"context"
	"errors"
	"log"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"github.com/h2non/filetype"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/rpc"
	"github.com/mreider/koto/backend/node/services/message"
	"github.com/mreider/koto/backend/token"
)

const (
	fileTypeBufSize = 8192
)

type messageService struct {
	*BaseService
}

func NewMessage(base *BaseService) rpc.MessageService {
	return &messageService{
		BaseService: base,
	}
}

func (s *messageService) Post(ctx context.Context, r *rpc.MessagePostRequest) (*rpc.MessagePostResponse, error) {
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

	rawFriendIDs := claims["friends"].([]interface{})
	friends := make([]string, len(rawFriendIDs))
	for i, rawID := range rawFriendIDs {
		friends[i] = rawID.(string)
	}

	messageID, err := uuid.NewV4()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentType, err := s.getAttachmentType(ctx, r.AttachmentId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentThumbnailID, err := s.getAttachmentThumbnailID(ctx, r.AttachmentId, attachmentType)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	now := common.CurrentTimestamp()
	msg := repo.Message{
		ID:                    messageID.String(),
		UserID:                claims["id"].(string),
		UserName:              claims["name"].(string),
		Text:                  r.Text,
		AttachmentID:          r.AttachmentId,
		AttachmentType:        attachmentType,
		AttachmentThumbnailID: attachmentThumbnailID,
		CreatedAt:             now,
		UpdatedAt:             now,
	}
	err = s.repos.Message.AddMessage("", msg)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	for _, friendID := range friends {
		err = s.repos.Notification.AddNotification(friendID, msg.UserName+" posted a new message", "message/post", map[string]interface{}{
			"user_id":    msg.UserID,
			"message_id": msg.ID,
		})
		if err != nil {
			log.Println(err)
		}
	}

	userTags := message.FindUserTags(msg.Text)
	users, err := s.repos.User.FindUsersByName(userTags)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	for _, u := range users {
		if u.ID != msg.UserID {
			err = s.repos.Notification.AddNotification(u.ID, msg.UserName+" tagged you in a message", "message/tag", map[string]interface{}{
				"user_id":    msg.UserID,
				"message_id": msg.ID,
			})
			if err != nil {
				log.Println(err)
			}
		}
	}

	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.MessagePostResponse{
		Message: &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			UserName:            msg.UserName,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      attachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
		},
	}, nil
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

	var from, until time.Time
	if r.From != "" {
		from, err = common.RPCStringToTime(r.From)
		if err != nil {
			return nil, twirp.InvalidArgumentError("from", err.Error())
		}
	}
	if r.Until != "" {
		until, err = common.RPCStringToTime(r.Until)
		if err != nil {
			return nil, twirp.InvalidArgumentError("until", err.Error())
		}
	}

	messages, err := s.repos.Message.Messages(userIDs, from, until)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	messageIDs := make([]string, len(messages))
	rpcMessages := make([]*rpc.Message, len(messages))
	rpcMessageMap := make(map[string]*rpc.Message, len(messages))
	for i, msg := range messages {
		messageIDs = append(messageIDs, msg.ID)
		attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
		attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcMessages[i] = &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			UserName:            msg.UserName,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      msg.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
		}
		rpcMessageMap[msg.ID] = rpcMessages[i]
	}

	comments, err := s.repos.Message.Comments(messageIDs)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	for messageID, messageComments := range comments {
		rpcComments := make([]*rpc.Message, len(messageComments))
		for i, comment := range messageComments {
			attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
			if err != nil {
				return nil, twirp.InternalErrorWith(err)
			}
			attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
			if err != nil {
				return nil, twirp.InternalErrorWith(err)
			}

			rpcComments[i] = &rpc.Message{
				Id:                  comment.ID,
				UserId:              comment.UserID,
				UserName:            comment.UserName,
				Text:                comment.Text,
				Attachment:          attachmentLink,
				AttachmentType:      comment.AttachmentType,
				AttachmentThumbnail: attachmentThumbnailLink,
				CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
				UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
			}
		}
		rpcMessageMap[messageID].Comments = rpcComments
	}

	return &rpc.MessageMessagesResponse{
		Messages: rpcMessages,
	}, nil
}

func (s *messageService) Edit(ctx context.Context, r *rpc.MessageEditRequest) (*rpc.MessageEditResponse, error) {
	user := s.getUser(ctx)
	now := common.CurrentTimestamp()
	if r.TextChanged {
		err := s.repos.Message.EditMessageText(user.ID, r.MessageId, r.Text, now)
		if err != nil {
			if errors.Is(err, repo.ErrMessageNotFound) {
				return nil, twirp.NotFoundError(err.Error())
			}
			return nil, twirp.InternalErrorWith(err)
		}
	}
	if r.AttachmentChanged {
		attachmentType, err := s.getAttachmentType(ctx, r.AttachmentId)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
		attachmentThumbnailID, err := s.getAttachmentThumbnailID(ctx, r.AttachmentId, attachmentType)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		err = s.repos.Message.EditMessageAttachment(user.ID, r.MessageId, r.AttachmentId, attachmentType, attachmentThumbnailID, now)
		if err != nil {
			if errors.Is(err, repo.ErrMessageNotFound) {
				return nil, twirp.NotFoundError(err.Error())
			}
			return nil, twirp.InternalErrorWith(err)
		}
	}

	msg, err := s.repos.Message.Message(r.MessageId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.MessageEditResponse{
		Message: &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			UserName:            msg.UserName,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      msg.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
		},
	}, nil
}

func (s *messageService) Delete(ctx context.Context, r *rpc.MessageDeleteRequest) (_ *rpc.Empty, err error) {
	user := s.getUser(ctx)

	err = s.repos.Message.DeleteMessage(user.ID, r.MessageId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) PostComment(ctx context.Context, r *rpc.MessagePostCommentRequest) (*rpc.MessagePostCommentResponse, error) {
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

	msg, err := s.repos.Message.Message(r.MessageId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}

	rawUserIDs := claims["users"].([]interface{})
	found := false
	for _, rawUserID := range rawUserIDs {
		userID := rawUserID.(string)
		if userID == msg.UserID {
			found = true
			break
		}
	}

	if !found {
		return nil, twirp.NotFoundError(repo.ErrMessageNotFound.Error())
	}

	commentID, err := uuid.NewV4()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentType, err := s.getAttachmentType(ctx, r.AttachmentId)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentThumbnailID, err := s.getAttachmentThumbnailID(ctx, r.AttachmentId, attachmentType)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	now := common.CurrentTimestamp()

	comment := repo.Message{
		ID:                    commentID.String(),
		UserID:                claims["id"].(string),
		UserName:              claims["name"].(string),
		Text:                  r.Text,
		AttachmentID:          r.AttachmentId,
		AttachmentType:        attachmentType,
		AttachmentThumbnailID: attachmentThumbnailID,
		CreatedAt:             now,
		UpdatedAt:             now,
	}
	err = s.repos.Message.AddMessage(r.MessageId, comment)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	if user.ID != msg.UserID {
		err = s.repos.Notification.AddNotification(msg.UserID, user.Name+" posted a new comment", "comment/post", map[string]interface{}{
			"user_id":    user.ID,
			"message_id": msg.ID,
			"comment_id": comment.ID,
		})
		if err != nil {
			log.Println(err)
		}
	}

	userTags := message.FindUserTags(comment.Text)
	users, err := s.repos.User.FindUsersByName(userTags)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	for _, u := range users {
		if u.ID != comment.UserID {
			err = s.repos.Notification.AddNotification(u.ID, comment.UserName+" tagged you in a comment", "comment/tag", map[string]interface{}{
				"user_id":    comment.UserID,
				"message_id": msg.ID,
				"comment_id": comment.ID,
			})
			if err != nil {
				log.Println(err)
			}
		}
	}

	attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.MessagePostCommentResponse{
		Comment: &rpc.Message{
			Id:                  comment.ID,
			UserId:              comment.UserID,
			UserName:            comment.UserName,
			Text:                comment.Text,
			Attachment:          attachmentLink,
			AttachmentType:      attachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
		},
	}, nil
}

func (s *messageService) EditComment(ctx context.Context, r *rpc.MessageEditCommentRequest) (*rpc.MessageEditCommentResponse, error) {
	user := s.getUser(ctx)
	now := common.CurrentTimestamp()
	if r.TextChanged {
		err := s.repos.Message.EditMessageText(user.ID, r.CommentId, r.Text, now)
		if err != nil {
			if errors.Is(err, repo.ErrMessageNotFound) {
				return nil, twirp.NotFoundError("comment not found")
			}
			return nil, twirp.InternalErrorWith(err)
		}
	}
	if r.AttachmentChanged {
		attachmentType, err := s.getAttachmentType(ctx, r.AttachmentId)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		attachmentThumbnailID, err := s.getAttachmentThumbnailID(ctx, r.AttachmentId, attachmentType)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		err = s.repos.Message.EditMessageAttachment(user.ID, r.CommentId, r.AttachmentId, attachmentType, attachmentThumbnailID, now)
		if err != nil {
			if errors.Is(err, repo.ErrMessageNotFound) {
				return nil, twirp.NotFoundError(err.Error())
			}
			return nil, twirp.InternalErrorWith(err)
		}
	}

	comment, err := s.repos.Message.Message(r.CommentId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError("comment not found")
		}
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.MessageEditCommentResponse{
		Comment: &rpc.Message{
			Id:                  comment.ID,
			UserId:              comment.UserID,
			UserName:            comment.UserName,
			Text:                comment.Text,
			Attachment:          attachmentLink,
			AttachmentType:      comment.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
		},
	}, nil
}

func (s *messageService) DeleteComment(ctx context.Context, r *rpc.MessageDeleteCommentRequest) (_ *rpc.Empty, err error) {
	user := s.getUser(ctx)
	err = s.repos.Message.DeleteMessage(user.ID, r.CommentId)
	if err != nil {
		if errors.Is(err, repo.ErrMessageNotFound) {
			return nil, twirp.NotFoundError("comment not found")
		}
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) getAttachmentType(ctx context.Context, attachmentID string) (string, error) {
	if attachmentID == "" {
		return "", nil
	}

	buf, err := s.s3Storage.ReadN(ctx, attachmentID, fileTypeBufSize)
	if err != nil {
		return "", err
	}
	t, err := filetype.Match(buf)
	if err != nil {
		return "", err
	}
	return t.MIME.Value, nil
}

func (s *messageService) getAttachmentThumbnailID(ctx context.Context, attachmentID, attachmentType string) (string, error) {
	if strings.HasPrefix(attachmentType, "image/") {
		return attachmentID, nil
	}

	if !strings.HasPrefix(attachmentType, "video/") {
		return "", nil
	}

	link, err := s.createBlobLink(ctx, attachmentID)
	if err != nil {
		return "", err
	}
	thumbnail, err := common.VideoThumbnail(link)
	if err != nil {
		return "", err
	}
	if len(thumbnail) == 0 {
		return "", nil
	}

	ext := filepath.Ext(attachmentID)
	attachmentThumbnailID := strings.TrimSuffix(attachmentID, ext) + "-thumbnail.jpg"
	err = s.s3Storage.PutObject(ctx, attachmentThumbnailID, thumbnail, "image/jpeg")
	if err != nil {
		return "", twirp.InternalErrorWith(err)
	}
	return attachmentThumbnailID, nil
}
