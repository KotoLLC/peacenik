package services

import (
	"bytes"
	"context"
	"log"
	"time"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/repo"

	"github.com/h2non/filetype"
)

type BaseService struct {
	repos              repo.Repos
	s3Storage          *common.S3Storage
	tokenGenerator     token.Generator
	tokenParser        token.Parser
	mailSender         *common.MailSender
	cfg                config.Config
	notificationSender NotificationSender
}

func NewBase(repos repo.Repos, s3Storage *common.S3Storage, tokenGenerator token.Generator, tokenParser token.Parser,
	mailSender *common.MailSender, cfg config.Config, notificationSender NotificationSender) *BaseService {
	return &BaseService{
		repos:              repos,
		s3Storage:          s3Storage,
		tokenGenerator:     tokenGenerator,
		tokenParser:        tokenParser,
		mailSender:         mailSender,
		cfg:                cfg,
		notificationSender: notificationSender,
	}
}

func (s *BaseService) getUser(ctx context.Context) repo.User {
	return ctx.Value(ContextUserKey).(repo.User)
}

func (s *BaseService) hasUser(ctx context.Context) bool {
	_, ok := ctx.Value(ContextUserKey).(repo.User)
	return ok
}

func (s *BaseService) isAdmin(ctx context.Context) bool {
	isAdmin, _ := ctx.Value(ContextIsAdminKey).(bool)
	return isAdmin
}

func (s *BaseService) createBlobLink(ctx context.Context, blobID string) (string, error) {
	if blobID == "" {
		return "", nil
	}
	return s.s3Storage.CreateLink(ctx, blobID, time.Hour*24)
}

func (s *BaseService) GetUserAttachments(ctx context.Context, user repo.User) common.MailAttachmentList {
	if user.AvatarThumbnailID == "" {
		return nil
	}

	var b bytes.Buffer
	err := s.s3Storage.Read(ctx, user.AvatarThumbnailID, &b)
	if err != nil {
		log.Println("can't read user avatar:", err)
		return nil
	}

	mimeType := ""
	fileName := "avatar"
	t, _ := filetype.Match(b.Bytes())
	if t != filetype.Unknown {
		mimeType = t.MIME.Value
		if t.Extension != "" {
			fileName += "." + t.Extension
		}
	}

	return common.MailAttachmentList{
		"avatar": {
			Inline:   true,
			Data:     b.Bytes(),
			FileName: fileName,
			MIMEType: mimeType,
		},
	}
}
