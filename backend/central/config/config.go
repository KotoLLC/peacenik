package config

import (
	"fmt"
	"time"

	"github.com/jinzhu/configor"

	"github.com/mreider/koto/backend/common"
)

type Config struct {
	ListenAddress        string   `yaml:"address" default:":12001" env:"KOTO_LISTEN_ADDRESS"`
	PrivateKeyPath       string   `yaml:"private_key_path" default:"central.rsa" env:"KOTO_PRIVATE_KEY"`
	Admins               []string `yaml:"admins" env:"KOTO_ADMINS"`
	TokenDurationSeconds int      `yaml:"token_duration" default:"3600" env:"KOTO_TOKEN_DURATION"`

	DB common.DatabaseConfig `yaml:"db"`
	S3 common.S3Config       `yaml:"s3"`
}

func Load(cfgPath string) (Config, error) {
	cfgPaths := make([]string, 0, 1)
	if cfgPath != "" {
		cfgPaths = append(cfgPaths, cfgPath)
	}

	var cfg Config
	err := configor.Load(&cfg, cfgPaths...)
	if err != nil {
		return Config{}, fmt.Errorf("can't load config: %w", err)
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
