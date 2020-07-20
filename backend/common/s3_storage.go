package common

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/minio/minio-go/v7"
)

const (
	defaultLinkExpiration = time.Minute * 10
)

type S3Storage struct {
	client *minio.Client
	bucket string

	cachedLinks   map[string]string
	cachedTimes   map[string]time.Time
	cachedLinksMu sync.Mutex
}

func NewS3Storage(client *minio.Client, bucket string) *S3Storage {
	return &S3Storage{
		client:      client,
		bucket:      bucket,
		cachedLinks: make(map[string]string),
		cachedTimes: make(map[string]time.Time),
	}
}

func (s *S3Storage) CreateBucketIfNotExist(ctx context.Context) error {
	exists, err := s.client.BucketExists(ctx, s.bucket)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	return s.client.MakeBucket(ctx, s.bucket, minio.MakeBucketOptions{})
}

func (s *S3Storage) Exists(ctx context.Context, blobID string) (bool, error) {
	info, err := s.client.StatObject(ctx, s.bucket, blobID, minio.StatObjectOptions{})
	if err != nil {
		return false, fmt.Errorf("can't StatObject: %w", err)
	}
	return info.Key != "", nil
}

func (s *S3Storage) Read(ctx context.Context, blobID string, w io.Writer) error {
	result, err := s.client.GetObject(ctx, s.bucket, blobID, minio.GetObjectOptions{})
	if err != nil {
		return fmt.Errorf("can't GetObject: %w", err)
	}
	defer func() { _ = result.Close() }()

	_, err = io.Copy(w, result)
	if err != nil {
		return fmt.Errorf("can't write GetObject body: %w", err)
	}
	return nil
}

func (s *S3Storage) CreateLink(ctx context.Context, blobID string, expiration time.Duration) (string, error) {
	if expiration <= 0 {
		expiration = defaultLinkExpiration
	}

	s.cachedLinksMu.Lock()
	defer s.cachedLinksMu.Unlock()

	expiresAt := time.Now().UTC().Add(expiration)
	cachedTime, ok := s.cachedTimes[blobID]
	if ok && expiresAt.After(cachedTime) && expiresAt.Before(cachedTime.Add(expiration/2)) {
		return s.cachedLinks[blobID], nil
	}

	u, err := s.client.PresignedGetObject(ctx, s.bucket, blobID, expiration, nil)
	if err != nil {
		return "", fmt.Errorf("can't Presign: %w", err)
	}

	s.cachedLinks[blobID] = u.String()
	s.cachedTimes[blobID] = expiresAt

	return u.String(), nil
}

func (s *S3Storage) PutObject(ctx context.Context, blobID string, content []byte, contentType string) error {
	_, err := s.client.PutObject(ctx, s.bucket, blobID, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return fmt.Errorf("can't PutObject: %w", err)
	}
	return nil
}

func (s *S3Storage) CreateUploadLink(ctx context.Context, blobID, contentType string, metadata map[string]string) (uploadLink string, formData map[string]string, err error) {
	expiration := defaultLinkExpiration

	policy := minio.NewPostPolicy()
	err = policy.SetBucket(s.bucket)
	if err != nil {
		return "", nil, fmt.Errorf("can't SetBucket for policy: %w", err)
	}
	err = policy.SetKey(blobID)
	if err != nil {
		return "", nil, fmt.Errorf("can't SetKey for policy: %w", err)
	}
	err = policy.SetExpires(time.Now().UTC().Add(expiration))
	if err != nil {
		return "", nil, fmt.Errorf("can't SetExpires for policy: %w", err)
	}
	err = policy.SetContentType(contentType)
	if err != nil {
		return "", nil, fmt.Errorf("can't SetContentType for policy: %w", err)
	}

	for key, value := range metadata {
		err = policy.SetUserMetadata(key, value)
		if err != nil {
			return "", nil, fmt.Errorf("can't SetContentType for policy: %w", err)
		}
	}

	link, formData, err := s.client.PresignedPostPolicy(ctx, policy)
	if err != nil {
		return "", nil, fmt.Errorf("can't Presign: %w", err)
	}

	return link.String(), formData, nil
}

func (s *S3Storage) RemoveObject(ctx context.Context, blobID string) error {
	err := s.client.RemoveObject(ctx, s.bucket, blobID, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("can't RemoveObject: %w", err)
	}
	return nil
}
