package services

import (
	"context"

	"github.com/gofrs/uuid"

	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/common"
)

type blobService struct {
	*BaseService
	s3Storage *common.S3Storage
}

func NewBlob(base *BaseService, s3Storage *common.S3Storage) rpc.BlobService {
	return &blobService{
		BaseService: base,
		s3Storage:   s3Storage,
	}
}

func (s *blobService) UploadLink(ctx context.Context, r *rpc.BlobUploadLinkRequest) (*rpc.BlobUploadLinkResponse, error) {
	blobID, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}
	uploadLink, formData, err := s.s3Storage.CreateUploadLink(ctx, blobID.String(), r.ContentType)
	if err != nil {
		return nil, err
	}
	return &rpc.BlobUploadLinkResponse{
		BlobId:   blobID.String(),
		Link:     uploadLink,
		FormData: formData,
	}, nil
}
