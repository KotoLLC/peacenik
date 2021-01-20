package services

import (
	"context"
	"path/filepath"
	"strings"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/rpc"
)

const (
	blobIDLength = 10
)

type blobService struct {
	*BaseService
}

func NewBlob(base *BaseService) rpc.BlobService {
	return &blobService{
		BaseService: base,
	}
}

func (s *blobService) UploadLink(ctx context.Context, r *rpc.BlobUploadLinkRequest) (*rpc.BlobUploadLinkResponse, error) {
	me := s.getMe(ctx)

	blobID, err := common.GenerateRandomString(blobIDLength)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	if r.FileName != "" {
		ext := filepath.Ext(r.FileName)
		blobID = strings.TrimSuffix(r.FileName, ext) + "-" + blobID + ext
	}

	meInfo := s.userCache.UserFullAccess(me.ID)
	uploadLink, formData, err := s.s3Storage.CreateUploadLink(ctx, blobID, r.ContentType,
		map[string]string{
			"user-id":   me.ID,
			"user-name": meInfo.Name,
		})
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return &rpc.BlobUploadLinkResponse{
		BlobId:   blobID,
		Link:     uploadLink,
		FormData: formData,
	}, nil
}
