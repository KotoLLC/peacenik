package config

import (
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/jinzhu/configor"

	"github.com/mreider/koto/backend/common"
)

type Config struct {
	ListenAddress        string `yaml:"address" default:":12001" env:"KOTO_LISTEN_ADDRESS"`
	PrivateKeyPath       string `yaml:"private_key_path" default:"user_hub.rsa" env:"KOTO_PRIVATE_KEY"`
	Admins               string `yaml:"admins" env:"KOTO_ADMINS"`
	TokenDurationSeconds int    `yaml:"token_duration" default:"3600" env:"KOTO_TOKEN_DURATION"`
	FrontendAddress      string `yaml:"frontend" default:"http://localhost:3000" env:"KOTO_FRONTEND_ADDRESS"`
	TestMode             bool   `yaml:"test_mode" default:"false" env:"KOTO_TEST_MODE"`
	AdminFriendship      string `yaml:"admin_friendship" default:"" env:"KOTO_ADMIN_FRIENDSHIP"`

	DB   common.DatabaseConfig `yaml:"db"`
	S3   common.S3Config       `yaml:"s3"`
	SMTP common.SMTPConfig     `yaml:"smtp"`

	adminList []string
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

	for _, admin := range strings.Split(cfg.Admins, ",") {
		cfg.adminList = append(cfg.adminList, strings.TrimSpace(admin))
	}

	cfg.FrontendAddress = common.CleanPublicURL(cfg.FrontendAddress)

	return cfg, nil
}

func (cfg Config) TokenDuration() time.Duration {
	return time.Duration(cfg.TokenDurationSeconds) * time.Second
}

func (cfg Config) IsAdmin(userName string) bool {
	for _, admin := range cfg.adminList {
		if admin == userName {
			return true
		}
	}
	return false
}

func (cfg Config) AdminList() []string {
	return cfg.adminList
}
