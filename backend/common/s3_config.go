package common

import (
	"context"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Config struct {
	Endpoint string `yaml:"endpoint" required:"true" env:"KOTO_S3_ENDPOINT"`
	Region   string `yaml:"region" env:"KOTO_S3_REGION"`
	Key      string `yaml:"key" required:"true" env:"KOTO_S3_KEY"`
	Secret   string `yaml:"secret" required:"true" env:"KOTO_S3_SECRET"`
	Bucket   string `yaml:"bucket" required:"true" env:"KOTO_S3_BUCKET"`
}

func (cfg S3Config) CreateStorage(ctx context.Context) (*S3Storage, error) {
	if cfg.Endpoint == "" {
		return nil, nil
	}

	s3Endpoint := cfg.Endpoint
	s3Secure := false
	if strings.HasPrefix(s3Endpoint, "https://") {
		s3Endpoint = strings.TrimPrefix(s3Endpoint, "https://")
		s3Secure = true
	} else {
		s3Endpoint = strings.TrimPrefix(s3Endpoint, "http://")
	}

	minioClient, err := minio.New(s3Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.Key, cfg.Secret, ""),
		Region: cfg.Region,
		Secure: s3Secure,
	})
	if err != nil {
		return nil, err
	}

	s3Storage := NewS3Storage(minioClient, cfg.Bucket)
	err = s3Storage.CreateBucketIfNotExist(ctx)
	if err != nil {
		return nil, err
	}
	return s3Storage, nil
}
