package common

import (
	"bytes"
	"context"
	"io"
	"log"
	"net/url"
	"sync"
	"time"

	"github.com/ansel1/merry"
	"github.com/minio/minio-go/v7"
)

const (
	defaultLinkExpiration = time.Minute * 30
)

type S3Storage struct {
	client         *minio.Client
	externalClient *minio.Client

	externalPathPrefix string

	bucket     string
	bucketOnce sync.Once

	cachedLinks   map[string]string
	cachedTimes   map[string]time.Time
	cachedLinksMu sync.Mutex
}

func NewS3Storage(client, externalClient *minio.Client, externalPathPrefix, bucket string) *S3Storage {
	if externalClient == nil {
		externalClient = client
	}

	return &S3Storage{
		client:             client,
		externalClient:     externalClient,
		externalPathPrefix: externalPathPrefix,
		bucket:             bucket,
		cachedLinks:        make(map[string]string),
		cachedTimes:        make(map[string]time.Time),
	}
}

func (s *S3Storage) createBucketIfNotExist(ctx context.Context) {
	s.bucketOnce.Do(func() {
		exists, err := s.client.BucketExists(ctx, s.bucket)
		if err != nil {
			log.Println(err)
			return
		}
		if exists {
			return
		}

		err = s.client.MakeBucket(ctx, s.bucket, minio.MakeBucketOptions{})
		if err != nil {
			log.Println(err)
		}
	})
}

func (s *S3Storage) Exists(ctx context.Context, blobID string) (bool, error) {
	s.createBucketIfNotExist(ctx)

	info, err := s.client.StatObject(ctx, s.bucket, blobID, minio.StatObjectOptions{})
	if err != nil {
		if minioErr, ok := err.(minio.ErrorResponse); ok && minioErr.Code == "NoSuchKey" {
			return false, nil
		}
		return false, merry.Prepend(err, "can't StatObject")
	}
	return info.Key != "", nil
}

func (s *S3Storage) Read(ctx context.Context, blobID string, w io.Writer) error {
	s.createBucketIfNotExist(ctx)

	result, err := s.client.GetObject(ctx, s.bucket, blobID, minio.GetObjectOptions{})
	if err != nil {
		return merry.Prepend(err, "can't GetObject")
	}
	defer func() { _ = result.Close() }()

	_, err = io.Copy(w, result)
	if err != nil {
		return merry.Prepend(err, "can't write GetObject body")
	}
	return nil
}

func (s *S3Storage) ReadN(ctx context.Context, blobID string, n int) ([]byte, error) {
	s.createBucketIfNotExist(ctx)

	result, err := s.client.GetObject(ctx, s.bucket, blobID, minio.GetObjectOptions{})
	if err != nil {
		return nil, merry.Prepend(err, "can't GetObject")
	}
	defer func() { _ = result.Close() }()

	buf := make([]byte, n)
	count, err := io.ReadFull(result, buf)
	if err != nil && !merry.Is(err, io.EOF) && !merry.Is(err, io.ErrUnexpectedEOF) {
		return nil, merry.Prepend(err, "can't write GetObject body")
	}
	return buf[:count], nil
}

func (s *S3Storage) CreateLink(ctx context.Context, blobID string, expiration time.Duration) (string, error) {
	s.createBucketIfNotExist(ctx)

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

	u, err := s.externalClient.PresignedGetObject(ctx, s.bucket, blobID, expiration, nil)
	if err != nil {
		return "", merry.Prepend(err, "can't Presign")
	}
	link := s.convertToExternalLink(u)

	s.cachedLinks[blobID] = link
	s.cachedTimes[blobID] = expiresAt

	return link, nil
}

func (s *S3Storage) PutObject(ctx context.Context, blobID string, content []byte, contentType string) error {
	s.createBucketIfNotExist(ctx)

	_, err := s.client.PutObject(ctx, s.bucket, blobID, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return merry.Prepend(err, "can't PutObject")
	}
	return nil
}

func (s *S3Storage) CreateUploadLink(ctx context.Context, blobID, contentType string, metadata map[string]string) (uploadLink string, formData map[string]string, err error) {
	s.createBucketIfNotExist(ctx)

	expiration := defaultLinkExpiration

	policy := minio.NewPostPolicy()
	err = policy.SetBucket(s.bucket)
	if err != nil {
		return "", nil, merry.Prepend(err, "can't SetBucket for policy")
	}
	err = policy.SetKey(blobID)
	if err != nil {
		return "", nil, merry.Prepend(err, "can't SetKey for policy")
	}
	err = policy.SetExpires(time.Now().UTC().Add(expiration))
	if err != nil {
		return "", nil, merry.Prepend(err, "can't SetExpires for policy")
	}
	err = policy.SetContentType(contentType)
	if err != nil {
		return "", nil, merry.Prepend(err, "can't SetContentType for policy")
	}

	for key, value := range metadata {
		err = policy.SetUserMetadata(key, value)
		if err != nil {
			return "", nil, merry.Prepend(err, "can't SetContentType for policy")
		}
	}

	u, formData, err := s.externalClient.PresignedPostPolicy(ctx, policy)
	if err != nil {
		return "", nil, merry.Prepend(err, "can't Presign")
	}
	link := s.convertToExternalLink(u)

	return link, formData, nil
}

func (s *S3Storage) RemoveObject(ctx context.Context, blobID string) error {
	s.createBucketIfNotExist(ctx)

	err := s.client.RemoveObject(ctx, s.bucket, blobID, minio.RemoveObjectOptions{})
	if err != nil {
		return merry.Prepend(err, "can't RemoveObject")
	}
	return nil
}

func (s *S3Storage) convertToExternalLink(link *url.URL) string {
	if s.externalPathPrefix != "" {
		link.Path = s.externalPathPrefix + link.Path
	}
	return link.String()
}
