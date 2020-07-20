package services

import (
	"context"

	"github.com/gofrs/uuid"

	"github.com/mreider/koto/backend/central/rpc"
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

	blobID, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}
	uploadLink, formData, err := s.s3Storage.CreateUploadLink(ctx, blobID.String(), r.ContentType,
		map[string]string{
			"user-id":   user.ID,
			"user-name": user.Name,
		})
	if err != nil {
		return nil, err
	}
	return &rpc.BlobUploadLinkResponse{
		BlobId:   blobID.String(),
		Link:     uploadLink,
		FormData: formData,
	}, nil
}
