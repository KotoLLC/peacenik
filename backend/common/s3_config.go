package common

import (
	"strings"

	"github.com/ansel1/merry"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Config struct {
	Endpoint         string `yaml:"endpoint" required:"true" env:"KOTO_S3_ENDPOINT"`
	ExternalEndpoint string `yaml:"external_endpoint" required:"false" env:"KOTO_S3_EXTERNAL_ENDPOINT"`
	Region           string `yaml:"region" env:"KOTO_S3_REGION"`
	Key              string `yaml:"key" required:"true" env:"KOTO_S3_KEY"`
	Secret           string `yaml:"secret" required:"true" env:"KOTO_S3_SECRET"`
	Bucket           string `yaml:"bucket" required:"true" env:"KOTO_S3_BUCKET"`
}

func (cfg S3Config) CreateStorage() (*S3Storage, error) {
	if cfg.Endpoint == "" {
		return nil, nil
	}

	s3Endpoint, s3Secure := cfg.splitEndpoint(cfg.Endpoint)

	client, err := minio.New(s3Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.Key, cfg.Secret, ""),
		Region: cfg.Region,
		Secure: s3Secure,
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	externalClient, externalPathPrefix, err := cfg.createExternalClient()
	if err != nil {
		return nil, merry.Wrap(err)
	}

	s3Storage := NewS3Storage(client, externalClient, externalPathPrefix, cfg.Bucket)
	return s3Storage, nil
}

func (cfg S3Config) createExternalClient() (*minio.Client, string, error) {
	if cfg.ExternalEndpoint == "" {
		return nil, "", nil
	}

	hostStartIndex := 0
	schemeSepIndex := strings.Index(cfg.ExternalEndpoint, "://")
	if schemeSepIndex >= 0 {
		hostStartIndex = schemeSepIndex + len("://")
	}

	slashIndex := strings.IndexRune(cfg.ExternalEndpoint[hostStartIndex:], '/')
	externalEndpoint, externalPathPrefix := cfg.ExternalEndpoint, ""
	if slashIndex >= 0 {
		slashIndex += hostStartIndex
		externalEndpoint, externalPathPrefix = cfg.ExternalEndpoint[:slashIndex], cfg.ExternalEndpoint[slashIndex:]
	}

	externalEndpoint, s3Secure := cfg.splitEndpoint(externalEndpoint)

	externalClient, err := minio.New(externalEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.Key, cfg.Secret, ""),
		Region: cfg.Region,
		Secure: s3Secure,
	})
	if err != nil {
		return nil, "", err
	}

	return externalClient, externalPathPrefix, err
}

func (cfg S3Config) splitEndpoint(endpoint string) (string, bool) {
	s3Secure := false
	if strings.HasPrefix(endpoint, "https://") {
		endpoint = strings.TrimPrefix(endpoint, "https://")
		s3Secure = true
	} else {
		endpoint = strings.TrimPrefix(endpoint, "http://")
	}
	return endpoint, s3Secure
}
