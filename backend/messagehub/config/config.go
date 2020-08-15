package config

import (
	"github.com/ansel1/merry"
	"github.com/jinzhu/configor"

	"github.com/mreider/koto/backend/common"
)

type Config struct {
	ListenAddress        string `yaml:"address" default:":12002" env:"KOTO_LISTEN_ADDRESS"`
	ExternalAddress      string `yaml:"external_address" default:"http://localhost:12002" env:"KOTO_EXTERNAL_ADDRESS"`
	CentralServerAddress string `yaml:"central_address" env:"KOTO_CENTRAL_ADDRESS"`
	UserHubAddress       string `yaml:"user_hub_address" env:"KOTO_USER_HUB_ADDRESS"`

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
		return Config{}, merry.Prepend(err, "can't load config")
	}

	cfg.ExternalAddress = common.CleanPublicURL(cfg.ExternalAddress)
	cfg.CentralServerAddress = common.CleanPublicURL(cfg.CentralServerAddress)
	cfg.UserHubAddress = common.CleanPublicURL(cfg.UserHubAddress)

	if cfg.UserHubAddress != "" {
		cfg.CentralServerAddress = cfg.UserHubAddress
	} else {
		cfg.UserHubAddress = cfg.CentralServerAddress
	}

	if cfg.UserHubAddress == "" {
		return Config{}, merry.New("UserHubAddress is empty")
	}

	return cfg, nil
}
