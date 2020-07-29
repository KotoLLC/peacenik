package services

import (
	"context"
	"path/filepath"
	"strings"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node/rpc"
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
	user := s.getUser(ctx)

	blobID, err := common.GenerateRandomString(blobIDLength)
	if err != nil {
		return nil, err
	}

	if r.FileName != "" {
		ext := filepath.Ext(r.FileName)
		blobID = strings.TrimSuffix(r.FileName, ext) + "-" + blobID + ext
	}

	uploadLink, formData, err := s.s3Storage.CreateUploadLink(ctx, blobID, r.ContentType,
		map[string]string{
			"user-id":   user.ID,
			"user-name": user.Name,
		})
	if err != nil {
		return nil, err
	}
	return &rpc.BlobUploadLinkResponse{
		BlobId:   blobID,
		Link:     uploadLink,
		FormData: formData,
	}, nil
}
