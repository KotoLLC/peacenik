package config

import (
	"github.com/ansel1/merry"
	"github.com/jinzhu/configor"

	"github.com/mreider/koto/backend/common"
)

type Config struct {
	ListenAddress        string `yaml:"address" default:":12002" env:"KOTO_LISTEN_ADDRESS"`
	ExternalAddress      string `yaml:"external_address" default:"http://localhost:12002" env:"KOTO_EXTERNAL_ADDRESS"`
	CentralServerAddress string `yaml:"central_address" required:"true" env:"KOTO_CENTRAL_ADDRESS"`

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
	return cfg, nil
}
