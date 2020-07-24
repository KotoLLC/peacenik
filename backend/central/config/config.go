package config

import (
	"fmt"
	"io"
	"time"

	"gopkg.in/yaml.v2"

	"github.com/mreider/koto/backend/common"
)

var (
	defaultListenAddress        = ":12001"
	defaultPrivateKeyPath       = "central.rsa"
	defaultTokenDurationSeconds = 3600
)

type Config struct {
	ListenAddress        string   `yaml:"address"`
	PrivateKeyPath       string   `yaml:"private_key_path"`
	Admins               []string `yaml:"admins"`
	TokenDurationSeconds int      `yaml:"token_duration"`

	DB common.DatabaseConfig `yaml:"db"`
	S3 common.S3Config       `yaml:"s3"`
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
	if cfg.PrivateKeyPath == "" {
		cfg.PrivateKeyPath = defaultPrivateKeyPath
	}
	if cfg.TokenDurationSeconds == 0 {
		cfg.TokenDurationSeconds = defaultTokenDurationSeconds
	}

	return cfg, nil
}

func (cfg Config) TokenDuration() time.Duration {
	return time.Duration(cfg.TokenDurationSeconds) * time.Second
}

func (cfg Config) IsAdmin(user string) bool {
	for _, admin := range cfg.Admins {
		if admin == user {
			return true
		}
	}
	return false
}
