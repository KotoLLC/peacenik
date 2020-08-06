package main

import (
	"context"
	"crypto/rsa"
	"flag"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/central"
	"github.com/mreider/koto/backend/central/config"
	"github.com/mreider/koto/backend/central/migrate"
	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
)

func main() {
	execDir, _ := filepath.Abs(filepath.Dir(os.Args[0]))

	cfg, err := loadConfig(execDir)
	if err != nil {
		log.Fatalln(err)
	}

	err = common.CreateDatabaseIfNotExist(cfg.DB)
	if err != nil {
		log.Fatalln(err)
	}

	db, n, err := common.OpenDatabase(cfg.DB, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, cfg.DB.DBName)

	s3Storage, err := cfg.S3.CreateStorage()
	if err != nil {
		log.Fatalln(err)
	}

	privateKey, publicKey, publicKeyPEM, err := token.RSAKeysFromPrivateKeyFile(cfg.PrivateKeyPath)
	if err != nil {
		log.Fatalln(err)
	}

	tokenGenerator := token.NewGenerator(privateKey)
	tokenParser := token.NewParser(func() *rsa.PublicKey {
		return publicKey
	})

	repos := repo.Repos{
		User:         repo.NewUsers(db),
		Invite:       repo.NewInvites(db),
		Friend:       repo.NewFriends(db),
		Node:         repo.NewNodes(db),
		Notification: common.NewNotifications(db),
	}

	s3Cleaner := common.NewS3Cleaner(db, s3Storage)
	go s3Cleaner.Clean(context.Background())

	server := central.NewServer(cfg, string(publicKeyPEM), repos, tokenGenerator, tokenParser, s3Storage)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}

func loadConfig(execDir string) (config.Config, error) {
	var configPath string

	flag.StringVar(&configPath, "config", "", "config path")
	flag.Parse()

	if configPath != "" {
		if !filepath.IsAbs(configPath) {
			configPath = filepath.Join(execDir, configPath)
		}
	}

	cfg, err := config.Load(configPath)
	if err != nil {
		return config.Config{}, merry.Wrap(err)
	}

	cfg.FrontendAddress = strings.TrimSuffix(cfg.FrontendAddress, "/")

	return cfg, nil
}
