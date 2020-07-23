package config

import (
	"fmt"
	"io"

	"gopkg.in/yaml.v2"

	"github.com/mreider/koto/backend/common"
)

var (
	defaultListenAddress        = ":12002"
	defaultExternalAddress      = "http://localhost:12002"
	defaultCentralServerAddress = "http://localhost:12001"
)

type Config struct {
	ListenAddress        string `yaml:"address"`
	ExternalAddress      string `yaml:"external_address"`
	DBPath               string `yaml:"db"`
	CentralServerAddress string `yaml:"central_address"`

	S3 common.S3Config `yaml:"s3"`
}

func Read(r io.Reader) (Config, error) {
	var cfg Config
	err := yaml.NewDecoder(r).Decode(&cfg)
	if err != nil {
		return Config{}, fmt.Errorf("can't parse config file: %w", err)
	}

	if cfg.ListenAddress == "" {
		cfg.ListenAddress = defaultListenAddress
	}
	if cfg.ExternalAddress == "" {
		cfg.ExternalAddress = defaultExternalAddress
	}
	if cfg.CentralServerAddress == "" {
		cfg.CentralServerAddress = defaultCentralServerAddress
	}

	return cfg, nil
}
