package services

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"image/jpeg"
	"log"
	"path/filepath"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/h2non/filetype"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/messagehub/repo"
	"github.com/mreider/koto/backend/messagehub/rpc"
	"github.com/mreider/koto/backend/messagehub/services/message"
)

const (
	fileTypeBufSize = 8192
)

func NewMessage(base *BaseService) rpc.MessageService {
	return &messageService{
		BaseService: base,
	}
}

type messageService struct {
	*BaseService
}

func (s *messageService) Post(ctx context.Context, r *rpc.MessagePostRequest) (*rpc.MessagePostResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	_, claims, err := s.tokenParser.Parse(r.Token, "post-message")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if me.ID != claims["id"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected user %s, was %s)", me.ID, claims["id"].(string)))
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	var notifiedUsers []string
	if rawFriends, ok := claims["friends"]; ok {
		rawFriendIDs := rawFriends.([]interface{})
		notifiedUsers = make([]string, len(rawFriendIDs))
		for i, rawID := range rawFriendIDs {
			notifiedUsers[i] = rawID.(string)
		}
	}

	var groupID sql.NullString
	if rawGroupID, ok := claims["group_id"]; ok {
		groupID = sql.NullString{
			String: rawGroupID.(string),
			Valid:  rawGroupID.(string) != "",
		}
	}

	var friendID sql.NullString
	if rawFriendID, ok := claims["friend_id"]; ok {
		friendID = sql.NullString{
			String: rawFriendID.(string),
			Valid:  rawFriendID.(string) != "",
		}
		notifiedUsers = []string{friendID.String}
	}

	isGuestHub := false
	if rawIsGuestHub, ok := claims["is_guest_hub"]; ok {
		isGuestHub, _ = rawIsGuestHub.(bool)
	}

	messageID := common.GenerateUUID()
	attachmentThumbnailID, attachmentType, err := s.processAttachment(ctx, r.AttachmentId)
	if err != nil {
		return nil, err
	}

	now := common.CurrentTimestamp()
	msg := repo.Message{
		ID:                    messageID,
		UserID:                claims["id"].(string),
		Text:                  r.Text,
		AttachmentID:          r.AttachmentId,
		AttachmentType:        attachmentType,
		AttachmentThumbnailID: attachmentThumbnailID,
		CreatedAt:             now,
		UpdatedAt:             now,
		GroupID:               groupID,
		IsGuest:               isGuestHub,
		FriendID:              friendID,
		IsPublic:              r.IsPublic,
	}
	s.repos.Message.AddMessage("", msg)

	notifyData := map[string]interface{}{
		"user_id":    msg.UserID,
		"message_id": msg.ID,
	}
	if groupID.Valid {
		notifyData["group-id"] = groupID.String
	}
	if friendID.Valid {
		notifyData["friend-id"] = friendID.String
	}

	if (len(notifiedUsers) > 0 || groupID.Valid) && s.notificationSender != nil {
		s.notificationSender.SendNotification(Notification{
			UserIDs:     notifiedUsers,
			Text:        me.DisplayName() + " posted a new message",
			MessageType: "message/post",
			Data:        notifyData,
		})
	}

	var userTags []string
	if !friendID.Valid {
		userTags = message.FindUserTags(msg.Text)
	}
	notifyUsers := make([]string, 0, len(userTags))
	for _, taggedUserID := range userTags {
		if taggedUserID != msg.UserID && !me.IsBlockedUser(taggedUserID) {
			notifyUsers = append(notifyUsers, taggedUserID)
		}
	}
	if len(notifyUsers) > 0 && s.notificationSender != nil {
		notification := Notification{
			UserIDs:     notifyUsers,
			Text:        me.DisplayName() + " mentioned you in a message",
			MessageType: "message/tag",
			Data:        notifyData,
		}
		s.notificationSender.SendNotification(notification)
	}
	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, err
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	return &rpc.MessagePostResponse{
		Message: &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      attachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
			Likes:               int32(msg.Likes),
			LikedByMe:           msg.LikedByMe,
			IsPublic:            msg.IsPublic,
		},
	}, nil
}

func (s *messageService) Messages(ctx context.Context, r *rpc.MessageMessagesRequest) (*rpc.MessageMessagesResponse, error) {
	me := s.getMe(ctx)

	_, claims, err := s.tokenParser.Parse(r.Token, "get-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if me.ID != claims["id"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected user %s, was %s)", me.ID, claims["id"].(string)))
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	var from time.Time
	if r.From != "" {
		from, err = common.RPCStringToTime(r.From)
		if err != nil {
			return nil, twirp.InvalidArgumentError("from", err.Error())
		}
	}

	var messages []repo.Message
	switch {
	case r.GroupId != "":
		found := false
		if rawGroupIDs, ok := claims["groups"]; ok {
			for _, rawGroupID := range rawGroupIDs.([]interface{}) {
				if rawGroupID.(string) == r.GroupId {
					found = true
					break
				}
			}
		}
		if !found {
			return &rpc.MessageMessagesResponse{}, nil
		}
		messages = s.repos.Message.GroupMessages(me.ID, r.GroupId, from, int(r.Count))
	case r.FriendId != "":
		messages = s.repos.Message.DirectMessages(me.ID, r.FriendId, from, int(r.Count))
	default:
		if rawUserIDs, ok := claims["users"]; ok {
			rawUserIDs := rawUserIDs.([]interface{})
			userIDs := make([]string, len(rawUserIDs))
			for i, rawUserID := range rawUserIDs {
				userIDs[i] = rawUserID.(string)
			}
			messages = s.repos.Message.Messages(me.ID, userIDs, from, int(r.Count))
		}
	}

	messageIDs := make([]string, len(messages))
	rpcMessages := make([]*rpc.Message, len(messages))
	rpcMessageMap := make(map[string]*rpc.Message, len(messages))
	for i, msg := range messages {
		messageIDs[i] = msg.ID
		attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
		if err != nil {
			return nil, err
		}
		attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
		if err != nil {
			return nil, err
		}

		rpcMessages[i] = &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      msg.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
			Likes:               int32(msg.Likes),
			LikedByMe:           msg.LikedByMe,
			IsPublic:            msg.IsPublic,
		}
		rpcMessageMap[msg.ID] = rpcMessages[i]
	}

	allLikes := s.repos.Message.MessagesLikes(messageIDs)
	for msgID, likes := range allLikes {
		rpcLikes := make([]*rpc.MessageLike, len(likes))
		for i, like := range likes {
			rpcLikes[i] = &rpc.MessageLike{
				UserId:  like.UserID,
				LikedAt: common.TimeToRPCString(like.CreatedAt),
			}
		}
		rpcMessageMap[msgID].LikedBy = rpcLikes
	}

	comments := s.repos.Message.Comments(me.ID, messageIDs)
	for messageID, messageComments := range comments {
		rpcComments := make([]*rpc.Message, 0, len(messageComments))
		for _, comment := range messageComments {
			if me.IsBlockedUser(comment.UserID) {
				continue
			}

			attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
			if err != nil {
				return nil, err
			}
			attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
			if err != nil {
				return nil, err
			}

			rpcComment := &rpc.Message{
				Id:                  comment.ID,
				UserId:              comment.UserID,
				Text:                comment.Text,
				Attachment:          attachmentLink,
				AttachmentType:      comment.AttachmentType,
				AttachmentThumbnail: attachmentThumbnailLink,
				CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
				UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
				Likes:               int32(comment.Likes),
				LikedByMe:           comment.LikedByMe,
				IsPublic:            comment.IsPublic,
			}
			rpcComments = append(rpcComments, rpcComment)
		}
		rpcMessageMap[messageID].Comments = rpcComments
	}

	return &rpc.MessageMessagesResponse{
		Messages: rpcMessages,
	}, nil
}

func (s *messageService) Message(ctx context.Context, r *rpc.MessageMessageRequest) (*rpc.MessageMessageResponse, error) {
	me := s.getMe(ctx)

	_, claims, err := s.tokenParser.Parse(r.Token, "get-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if me.ID != claims["id"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected user %s, was %s)", me.ID, claims["id"].(string)))
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	msg := s.repos.Message.Message(me.ID, r.MessageId)
	if msg == nil {
		return nil, twirp.NotFoundError("message not found")
	}

	found := false
	if msg.GroupID.Valid {
		if rawGroupIDs, ok := claims["groups"]; ok {
			for _, rawGroupID := range rawGroupIDs.([]interface{}) {
				if rawGroupID.(string) == msg.GroupID.String {
					found = true
					break
				}
			}
		}
	} else {
		if rawUserIDs, ok := claims["users"]; ok {
			for _, rawUserID := range rawUserIDs.([]interface{}) {
				if rawUserID.(string) == msg.UserID {
					found = true
					break
				}
			}
		}
	}

	if !found {
		return nil, twirp.NotFoundError("not found")
	}

	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, err
	}
	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	rpcMessage := &rpc.Message{
		Id:                  msg.ID,
		UserId:              msg.UserID,
		Text:                msg.Text,
		Attachment:          attachmentLink,
		AttachmentType:      msg.AttachmentType,
		AttachmentThumbnail: attachmentThumbnailLink,
		CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
		UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
		Likes:               int32(msg.Likes),
		LikedByMe:           msg.LikedByMe,
		IsPublic:            msg.IsPublic,
	}

	allLikes := s.repos.Message.MessagesLikes([]string{msg.ID})
	for _, likes := range allLikes {
		rpcLikes := make([]*rpc.MessageLike, len(likes))
		for i, like := range likes {
			rpcLikes[i] = &rpc.MessageLike{
				UserId:  like.UserID,
				LikedAt: common.TimeToRPCString(like.CreatedAt),
			}
		}
		rpcMessage.LikedBy = rpcLikes
	}

	comments := s.repos.Message.Comments(me.ID, []string{msg.ID})
	for _, messageComments := range comments {
		rpcComments := make([]*rpc.Message, 0, len(messageComments))
		for _, comment := range messageComments {
			if me.IsBlockedUser(comment.UserID) {
				continue
			}

			attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
			if err != nil {
				return nil, err
			}
			attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
			if err != nil {
				return nil, err
			}

			rpcComment := &rpc.Message{
				Id:                  comment.ID,
				UserId:              comment.UserID,
				Text:                comment.Text,
				Attachment:          attachmentLink,
				AttachmentType:      comment.AttachmentType,
				AttachmentThumbnail: attachmentThumbnailLink,
				CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
				UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
				Likes:               int32(comment.Likes),
				LikedByMe:           comment.LikedByMe,
				IsPublic:            comment.IsPublic,
			}
			rpcComments = append(rpcComments, rpcComment)
		}
		rpcMessage.Comments = rpcComments
	}

	return &rpc.MessageMessageResponse{
		Message: rpcMessage,
	}, nil
}

func (s *messageService) PublicMessages(ctx context.Context, r *rpc.MessagePublicMessagesRequest) (*rpc.MessagePublicMessagesResponse, error) {
	_, claims, err := s.tokenParser.Parse(r.Token, "get-public-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	var from time.Time
	if r.From != "" {
		from, err = common.RPCStringToTime(r.From)
		if err != nil {
			return nil, twirp.InvalidArgumentError("from", err.Error())
		}
	}

	var messages []repo.Message
	if rawUserID, ok := claims["user"]; ok {
		userID := rawUserID.(string)
		messages = s.repos.Message.PublicMessages(userID, from, int(r.Count))
	}

	messageIDs := make([]string, len(messages))
	rpcMessages := make([]*rpc.Message, len(messages))
	rpcMessageMap := make(map[string]*rpc.Message, len(messages))
	for i, msg := range messages {
		messageIDs[i] = msg.ID
		attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
		if err != nil {
			return nil, err
		}
		attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
		if err != nil {
			return nil, err
		}

		rpcMessages[i] = &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      msg.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
			Likes:               int32(msg.Likes),
			LikedByMe:           msg.LikedByMe,
			IsPublic:            msg.IsPublic,
		}
		rpcMessageMap[msg.ID] = rpcMessages[i]
	}

	return &rpc.MessagePublicMessagesResponse{
		Messages: rpcMessages,
	}, nil
}

func (s *messageService) PublicMessage(ctx context.Context, r *rpc.MessagePublicMessageRequest) (*rpc.MessagePublicMessageResponse, error) {
	_, claims, err := s.tokenParser.Parse(r.Token, "get-public-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	msg := s.repos.Message.PublicMessage(r.MessageId)
	if msg == nil {
		return nil, twirp.NotFoundError("message not found")
	}

	found := false
	if rawUserID, ok := claims["user"]; ok {
		found = rawUserID.(string) == msg.UserID
	}

	if !found {
		return nil, twirp.NotFoundError("not found")
	}

	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, err
	}
	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	rpcMessage := &rpc.Message{
		Id:                  msg.ID,
		UserId:              msg.UserID,
		Text:                msg.Text,
		Attachment:          attachmentLink,
		AttachmentType:      msg.AttachmentType,
		AttachmentThumbnail: attachmentThumbnailLink,
		CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
		UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
		Likes:               int32(msg.Likes),
		LikedByMe:           msg.LikedByMe,
		IsPublic:            msg.IsPublic,
	}

	return &rpc.MessagePublicMessageResponse{
		Message: rpcMessage,
	}, nil
}

func (s *messageService) Edit(ctx context.Context, r *rpc.MessageEditRequest) (*rpc.MessageEditResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	now := common.CurrentTimestamp()
	if r.TextChanged {
		if !s.repos.Message.EditMessageText(me.ID, r.MessageId, r.Text, now) {
			return nil, twirp.NotFoundError("not found")
		}
	}
	if r.AttachmentChanged {
		attachmentThumbnailID, attachmentType, err := s.processAttachment(ctx, r.AttachmentId)
		if err != nil {
			return nil, err
		}

		if !s.repos.Message.EditMessageAttachment(me.ID, r.MessageId, r.AttachmentId, attachmentType, attachmentThumbnailID, now) {
			return nil, twirp.NotFoundError("not found")
		}
	}

	msg := s.repos.Message.Message(me.ID, r.MessageId)
	if msg == nil {
		return nil, twirp.NotFoundError("not found")
	}

	attachmentLink, err := s.createBlobLink(ctx, msg.AttachmentID)
	if err != nil {
		return nil, err
	}
	attachmentThumbnailLink, err := s.createBlobLink(ctx, msg.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	return &rpc.MessageEditResponse{
		Message: &rpc.Message{
			Id:                  msg.ID,
			UserId:              msg.UserID,
			Text:                msg.Text,
			Attachment:          attachmentLink,
			AttachmentType:      msg.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(msg.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(msg.UpdatedAt),
			Likes:               int32(msg.Likes),
			LikedByMe:           msg.LikedByMe,
			IsPublic:            msg.IsPublic,
		},
	}, nil
}

func (s *messageService) Delete(ctx context.Context, r *rpc.MessageDeleteRequest) (_ *rpc.Empty, err error) {
	me := s.getMe(ctx)
	msg := s.repos.Message.Message(me.ID, r.MessageId)
	switch {
	case msg == nil:
		return nil, twirp.NotFoundError("not found")
	case msg.UserID == me.ID:
		if !s.repos.Message.DeleteMessage(r.MessageId) {
			return nil, twirp.NotFoundError("not found")
		}
	case msg.GroupID.Valid && me.IsOwnedGroup(msg.GroupID.String):
		if !s.repos.Message.DeleteMessage(r.MessageId) {
			return nil, twirp.NotFoundError("not found")
		}
	default:
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) PostComment(ctx context.Context, r *rpc.MessagePostCommentRequest) (*rpc.MessagePostCommentResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	_, claims, err := s.tokenParser.Parse(r.Token, "get-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if me.ID != claims["id"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected user %s, was %s)", me.ID, claims["id"].(string)))
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	msg := s.repos.Message.Message(me.ID, r.MessageId)
	if msg == nil {
		return nil, twirp.NotFoundError("not found")
	}

	found := false
	switch {
	case msg.GroupID.Valid:
		if rawGroupIDs, ok := claims["groups"]; ok {
			for _, rawGroupID := range rawGroupIDs.([]interface{}) {
				if rawGroupID.(string) == msg.GroupID.String {
					found = true
					break
				}
			}
		}
	case msg.FriendID.Valid:
		found = me.ID == msg.UserID || me.ID == msg.FriendID.String
	default:
		if rawUserIDs, ok := claims["users"]; ok {
			for _, rawUserID := range rawUserIDs.([]interface{}) {
				if rawUserID.(string) == msg.UserID {
					found = true
					break
				}
			}
		}
	}

	if !found {
		return nil, twirp.NotFoundError("not found")
	}

	commentID := common.GenerateUUID()
	attachmentThumbnailID, attachmentType, err := s.processAttachment(ctx, r.AttachmentId)
	if err != nil {
		return nil, err
	}

	now := common.CurrentTimestamp()
	comment := repo.Message{
		ID:                    commentID,
		UserID:                claims["id"].(string),
		Text:                  r.Text,
		AttachmentID:          r.AttachmentId,
		AttachmentType:        attachmentType,
		AttachmentThumbnailID: attachmentThumbnailID,
		CreatedAt:             now,
		UpdatedAt:             now,
		GroupID:               msg.GroupID,
		IsGuest:               msg.IsGuest,
	}
	s.repos.Message.AddMessage(r.MessageId, comment)

	notifyData := map[string]interface{}{
		"user_id":    me.ID,
		"message_id": msg.ID,
		"comment_id": comment.ID,
	}
	if msg.GroupID.Valid {
		notifyData["group-id"] = msg.GroupID.String
	}
	if msg.FriendID.Valid {
		notifyData["friend-id"] = msg.FriendID.String
	}

	if me.ID != msg.UserID {
		s.notificationSender.SendNotification(Notification{
			UserIDs:     []string{msg.UserID},
			Text:        me.DisplayName() + " posted a new comment",
			MessageType: "comment/post",
			Data:        notifyData,
		})
	}

	userTags := message.FindUserTags(comment.Text)
	notifyUsers := make([]string, 0, len(userTags))
	for _, taggedUserID := range userTags {
		if taggedUserID != comment.UserID && !me.IsBlockedUser(taggedUserID) {
			notifyUsers = append(notifyUsers, taggedUserID)
		}
	}
	s.notificationSender.SendNotification(Notification{
		UserIDs:     notifyUsers,
		Text:        me.DisplayName() + " mentioned you in a comment",
		MessageType: "comment/tag",
		Data:        notifyData,
	})

	attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
	if err != nil {
		return nil, err
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	return &rpc.MessagePostCommentResponse{
		Comment: &rpc.Message{
			Id:                  comment.ID,
			UserId:              comment.UserID,
			Text:                comment.Text,
			Attachment:          attachmentLink,
			AttachmentType:      attachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
			Likes:               int32(comment.Likes),
			LikedByMe:           comment.LikedByMe,
			IsPublic:            comment.IsPublic,
		},
	}, nil
}

func (s *messageService) EditComment(ctx context.Context, r *rpc.MessageEditCommentRequest) (*rpc.MessageEditCommentResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	now := common.CurrentTimestamp()
	if r.TextChanged {
		if !s.repos.Message.EditMessageText(me.ID, r.CommentId, r.Text, now) {
			return nil, twirp.NotFoundError("not found")
		}
	}
	if r.AttachmentChanged {
		attachmentThumbnailID, attachmentType, err := s.processAttachment(ctx, r.AttachmentId)
		if err != nil {
			return nil, err
		}

		if !s.repos.Message.EditMessageAttachment(me.ID, r.CommentId, r.AttachmentId, attachmentType, attachmentThumbnailID, now) {
			return nil, twirp.NotFoundError("not found")
		}
	}

	comment := s.repos.Message.Message(me.ID, r.CommentId)
	if comment == nil {
		return nil, twirp.NotFoundError("not found")
	}

	attachmentLink, err := s.createBlobLink(ctx, comment.AttachmentID)
	if err != nil {
		return nil, err
	}

	attachmentThumbnailLink, err := s.createBlobLink(ctx, comment.AttachmentThumbnailID)
	if err != nil {
		return nil, err
	}

	return &rpc.MessageEditCommentResponse{
		Comment: &rpc.Message{
			Id:                  comment.ID,
			UserId:              comment.UserID,
			Text:                comment.Text,
			Attachment:          attachmentLink,
			AttachmentType:      comment.AttachmentType,
			AttachmentThumbnail: attachmentThumbnailLink,
			CreatedAt:           common.TimeToRPCString(comment.CreatedAt),
			UpdatedAt:           common.TimeToRPCString(comment.UpdatedAt),
			Likes:               int32(comment.Likes),
			LikedByMe:           comment.LikedByMe,
			IsPublic:            comment.IsPublic,
		},
	}, nil
}

func (s *messageService) DeleteComment(ctx context.Context, r *rpc.MessageDeleteCommentRequest) (_ *rpc.Empty, err error) {
	me := s.getMe(ctx)
	comment := s.repos.Message.Message(me.ID, r.CommentId)
	switch {
	case comment == nil:
		return nil, twirp.NotFoundError("not found")
	case comment.UserID == me.ID:
		if !s.repos.Message.DeleteMessage(r.CommentId) {
			return nil, twirp.NotFoundError("not found")
		}
	case comment.GroupID.Valid && me.IsOwnedGroup(comment.GroupID.String):
		if !s.repos.Message.DeleteMessage(r.CommentId) {
			return nil, twirp.NotFoundError("not found")
		}
	default:
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) getAttachmentType(ctx context.Context, attachmentID string) (string, error) {
	if attachmentID == "" {
		return "", nil
	}

	buf, err := s.s3Storage.ReadN(ctx, attachmentID, fileTypeBufSize)
	if err != nil {
		return "", merry.Wrap(err)
	}
	t, err := filetype.Match(buf)
	if err != nil {
		return "", merry.Wrap(err)
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
		return "", merry.Wrap(err)
	}
	thumbnail, err := common.VideoThumbnail(link)
	if err != nil {
		return "", merry.Wrap(err)
	}
	if len(thumbnail) == 0 {
		return "", nil
	}

	ext := filepath.Ext(attachmentID)
	attachmentThumbnailID := strings.TrimSuffix(attachmentID, ext) + "-thumbnail.jpg"
	err = s.s3Storage.PutObject(ctx, attachmentThumbnailID, thumbnail, "image/jpeg")
	if err != nil {
		return "", err
	}
	return attachmentThumbnailID, nil
}

func (s *messageService) LikeMessage(ctx context.Context, r *rpc.MessageLikeMessageRequest) (*rpc.MessageLikeMessageResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	msg := s.repos.Message.Message(me.ID, r.MessageId)
	if msg == nil {
		return &rpc.MessageLikeMessageResponse{
			Likes: -1,
		}, nil
	}

	if msg.ParentID.Valid {
		return nil, twirp.InvalidArgumentError("message_id", "is not a message")
	}

	if me.IsBlockedUser(msg.UserID) {
		return nil, twirp.NotFoundError("message not found")
	}

	var newLikeCount int
	if r.Unlike {
		newLikeCount = s.repos.Message.UnlikeMessage(me.ID, msg.ID)
	} else {
		newLikeCount = s.repos.Message.LikeMessage(me.ID, msg.ID)
		notifyData := map[string]interface{}{
			"user_id":    me.ID,
			"message_id": msg.ID,
		}
		if msg.GroupID.Valid {
			notifyData["group-id"] = msg.GroupID.String
		}
		if msg.FriendID.Valid {
			notifyData["friend-id"] = msg.FriendID.String
		}
		s.notificationSender.SendNotification(Notification{
			UserIDs:     []string{msg.UserID},
			Text:        me.DisplayName() + " liked your post",
			MessageType: "message/like",
			Data:        notifyData,
		})
	}

	return &rpc.MessageLikeMessageResponse{
		Likes: int32(newLikeCount),
	}, nil
}

func (s *messageService) LikeComment(ctx context.Context, r *rpc.MessageLikeCommentRequest) (*rpc.MessageLikeCommentResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	comment := s.repos.Message.Message(me.ID, r.CommentId)
	if comment == nil {
		return &rpc.MessageLikeCommentResponse{
			Likes: -1,
		}, nil
	}

	if !comment.ParentID.Valid {
		return nil, twirp.InvalidArgumentError("comment_id", "is not a comment")
	}

	if me.IsBlockedUser(comment.UserID) {
		return nil, twirp.NotFoundError("message not found")
	}

	var newLikeCount int
	if r.Unlike {
		newLikeCount = s.repos.Message.UnlikeMessage(me.ID, comment.ID)
	} else {
		newLikeCount = s.repos.Message.LikeMessage(me.ID, comment.ID)

		msg := s.repos.Message.Message(me.ID, comment.ParentID.String)
		notifyData := map[string]interface{}{
			"user_id":    me.ID,
			"message_id": comment.ParentID.String,
			"comment_id": comment.ID,
		}
		if msg != nil && msg.GroupID.Valid {
			notifyData["group-id"] = msg.GroupID.String
		}
		if msg != nil && msg.FriendID.Valid {
			notifyData["friend-id"] = msg.FriendID.String
		}
		s.notificationSender.SendNotification(Notification{
			UserIDs:     []string{comment.UserID},
			Text:        me.DisplayName() + " liked your comment",
			MessageType: "comment/like",
			Data:        notifyData,
		})
	}
	return &rpc.MessageLikeCommentResponse{
		Likes: int32(newLikeCount),
	}, nil
}

func (s *messageService) MessageLikes(_ context.Context, r *rpc.MessageMessageLikesRequest) (*rpc.MessageMessageLikesResponse, error) {
	likes := s.repos.Message.MessageLikes(r.MessageId)
	rpcLikes := make([]*rpc.MessageLike, len(likes))
	for i, like := range likes {
		rpcLikes[i] = &rpc.MessageLike{
			UserId:  like.UserID,
			LikedAt: common.TimeToRPCString(like.CreatedAt),
		}
	}
	return &rpc.MessageMessageLikesResponse{
		Likes: rpcLikes,
	}, nil
}

func (s *messageService) CommentLikes(_ context.Context, r *rpc.MessageCommentLikesRequest) (*rpc.MessageCommentLikesResponse, error) {
	likes := s.repos.Message.MessageLikes(r.CommentId)
	rpcLikes := make([]*rpc.MessageLike, len(likes))
	for i, like := range likes {
		rpcLikes[i] = &rpc.MessageLike{
			UserId:  like.UserID,
			LikedAt: common.TimeToRPCString(like.CreatedAt),
		}
	}
	return &rpc.MessageCommentLikesResponse{
		Likes: rpcLikes,
	}, nil
}

func (s *messageService) processAttachment(ctx context.Context, attachmentID string) (attachmentThumbnailID, attachmentType string, err error) {
	attachmentType, err = s.getAttachmentType(ctx, attachmentID)
	if err != nil {
		return "", "", err
	}

	attachmentThumbnailID, err = s.getAttachmentThumbnailID(ctx, attachmentID, attachmentType)
	if err != nil {
		return "", "", err
	}

	if attachmentType != "image/jpeg" {
		return attachmentThumbnailID, attachmentType, nil
	}

	var buf bytes.Buffer
	err = s.s3Storage.Read(ctx, attachmentID, &buf)
	if err != nil {
		log.Println("can't read attachment:", err)
		return attachmentThumbnailID, attachmentType, nil
	}

	orientation := common.GetImageOrientation(bytes.NewReader(buf.Bytes()))
	if orientation == "1" {
		return attachmentThumbnailID, attachmentType, nil
	}
	if img, err := common.DecodeImageAndFixOrientation(bytes.NewReader(buf.Bytes()), orientation); err == nil {
		buf.Reset()
		if err := jpeg.Encode(&buf, img, nil); err == nil {
			_ = s.s3Storage.PutObject(ctx, attachmentID, buf.Bytes(), attachmentType)
		}
	}
	return attachmentThumbnailID, attachmentType, nil
}

func (s *messageService) SetMessageVisibility(ctx context.Context, r *rpc.MessageSetMessageVisibilityRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	s.repos.Message.SetMessageVisibility(me.ID, r.MessageId, r.Visibility)
	return &rpc.Empty{}, nil
}

func (s *messageService) SetCommentVisibility(ctx context.Context, r *rpc.MessageSetCommentVisibilityRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	s.repos.Message.SetMessageVisibility(me.ID, r.CommentId, r.Visibility)
	return &rpc.Empty{}, nil
}

func (s *messageService) ReportMessage(ctx context.Context, r *rpc.MessageReportMessageRequest) (*rpc.MessageReportMessageResponse, error) {
	me := s.getMe(ctx)
	if me.IsBlocked {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	reportID := s.repos.Message.ReportMessage(me.ID, r.MessageId, r.Report)
	return &rpc.MessageReportMessageResponse{
		ReportId: reportID,
	}, nil
}

func (s *messageService) MessageReport(ctx context.Context, r *rpc.MessageMessageReportRequest) (*rpc.MessageMessageReportResponse, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	report := s.repos.Message.MessageReport(r.ReportId)
	if report == nil {
		return nil, twirp.NotFoundError("not found")
	}

	return &rpc.MessageMessageReportResponse{
		ReportedBy: report.ReportedByID,
		Report:     report.Report,
		AuthorId:   report.AuthorID,
	}, nil
}

func (s *messageService) MessageReports(ctx context.Context, _ *rpc.Empty) (*rpc.MessageMessageReportsResponse, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	reports := s.repos.Message.MessageReports()
	rpcReports := make([]*rpc.MessageReport, len(reports))
	for i, report := range reports {
		attachmentLink, err := s.createBlobLink(ctx, report.AttachmentID)
		if err != nil {
			return nil, err
		}
		attachmentThumbnailLink, err := s.createBlobLink(ctx, report.AttachmentThumbnailID)
		if err != nil {
			return nil, err
		}

		rpcReports[i] = &rpc.MessageReport{
			Id:                  report.ID,
			ReporterId:          report.ReportedByID,
			Report:              report.Report,
			CreatedAt:           common.TimeToRPCString(report.CreatedAt),
			ResolvedAt:          common.NullTimeToRPCString(report.ResolvedAt),
			MessageId:           report.MessageID,
			AuthorId:            report.AuthorID,
			Text:                report.Text,
			AttachmentType:      report.AttachmentType,
			Attachment:          attachmentLink,
			AttachmentThumbnail: attachmentThumbnailLink,
		}
	}

	return &rpc.MessageMessageReportsResponse{
		Reports: rpcReports,
	}, nil
}

func (s *messageService) DeleteReportedMessage(ctx context.Context, r *rpc.MessageDeleteReportedMessageRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	if !s.repos.Message.DeleteReportedMessage(r.ReportId) {
		return nil, twirp.NotFoundError("not found")
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) BlockReportedUser(ctx context.Context, r *rpc.MessageBlockReportedUserRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	if !s.repos.Message.BlockReportedUser(r.ReportId) {
		return nil, twirp.NotFoundError("not found")
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) ResolveMessageReport(ctx context.Context, r *rpc.MessageResolveMessageReportRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	if !me.IsHubAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	if !s.repos.Message.ResolveMessageReport(r.ReportId) {
		return nil, twirp.NotFoundError("not found")
	}
	return &rpc.Empty{}, nil
}

func (s *messageService) MarkRead(ctx context.Context, r *rpc.MessageMarkReadRequest) (*rpc.Empty, error) {
	me := s.getMe(ctx)
	s.repos.Message.MarkRead(me.ID, r.MessageIds)
	return &rpc.Empty{}, nil
}

func (s *messageService) Counters(ctx context.Context, r *rpc.MessageCountersRequest) (*rpc.MessageCountersResponse, error) {
	me := s.getMe(ctx)

	_, claims, err := s.tokenParser.Parse(r.Token, "get-messages")
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
	}

	if me.ID != claims["id"].(string) {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected user %s, was %s)", me.ID, claims["id"].(string)))
	}

	if strings.TrimSuffix(s.externalAddress, "/") != strings.TrimSuffix(claims["hub"].(string), "/") {
		return nil, twirp.NewError(twirp.InvalidArgument, fmt.Sprintf("invalid token (expected hub %s, was %s)", s.externalAddress, claims["hub"].(string)))
	}

	var userIDs []string
	if rawUserIDs, ok := claims["users"]; ok {
		rawUserIDs := rawUserIDs.([]interface{})
		userIDs = make([]string, len(rawUserIDs))
		for i, rawUserID := range rawUserIDs {
			userIDs[i] = rawUserID.(string)
		}
	}

	var groupIDs []string
	if rawGroupIDs, ok := claims["groups"]; ok {
		rawGroupIDs := rawGroupIDs.([]interface{})
		groupIDs = make([]string, len(rawGroupIDs))
		for i, rawGroupID := range rawGroupIDs {
			groupIDs[i] = rawGroupID.(string)
		}
	}

	counts := s.repos.Message.Counts(me.ID, userIDs)

	groupCounts := s.repos.Message.GroupCounts(me.ID, groupIDs)
	rpcGroupCounts := make(map[string]*rpc.MessageCounters, len(groupCounts))
	for groupID, counts := range groupCounts {
		rpcGroupCounts[groupID] = &rpc.MessageCounters{
			TotalCount:         int32(counts.TotalCount),
			UnreadCount:        int32(counts.UnreadCount),
			TotalCommentCount:  int32(counts.TotalCommentCount),
			UnreadCommentCount: int32(counts.UnreadCommentCount),
			LastMessageTime:    common.NullTimeToRPCString(counts.LastMessageTime),
		}
	}

	directCounts := s.repos.Message.DirectCounts(me.ID)
	rpcDirectCounts := make(map[string]*rpc.MessageCounters, len(directCounts))
	for userID, counts := range directCounts {
		rpcDirectCounts[userID] = &rpc.MessageCounters{
			TotalCount:         int32(counts.TotalCount),
			UnreadCount:        int32(counts.UnreadCount),
			TotalCommentCount:  int32(counts.TotalCommentCount),
			UnreadCommentCount: int32(counts.UnreadCommentCount),
			LastMessageTime:    common.NullTimeToRPCString(counts.LastMessageTime),
		}
	}

	return &rpc.MessageCountersResponse{
		TotalCount:         int32(counts.TotalCount),
		UnreadCount:        int32(counts.UnreadCount),
		TotalCommentCount:  int32(counts.TotalCommentCount),
		UnreadCommentCount: int32(counts.UnreadCommentCount),
		GroupCounters:      rpcGroupCounts,
		DirectCounters:     rpcDirectCounts,
	}, err
}
