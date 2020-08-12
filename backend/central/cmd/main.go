package main

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"flag"
	"log"
	"os"
	"path/filepath"

	"github.com/ansel1/merry"
	"github.com/rakyll/statik/fs"

	"github.com/mreider/koto/backend/central"
	"github.com/mreider/koto/backend/central/config"
	"github.com/mreider/koto/backend/central/migrate"
	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/common"
	_ "github.com/mreider/koto/backend/statik"
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

	_, err = os.Stat(cfg.PrivateKeyPath)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Fatalln(err)
		}
		err := generateRSAKey(cfg.PrivateKeyPath)
		if err != nil {
			log.Fatalln(err)
		}
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

	staticFS, err := fs.New()
	if err != nil {
		log.Fatalln(err)
	}

	server := central.NewServer(cfg, string(publicKeyPEM), repos, tokenGenerator, tokenParser, s3Storage, staticFS)
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

	return cfg, nil
}

func generateRSAKey(keyPath string) error {
	const bitSize = 1024
	reader := rand.Reader
	key, err := rsa.GenerateKey(reader, bitSize)
	if err != nil {
		return err
	}

	outFile, err := os.Create(keyPath)
	if err != nil {
		return err
	}
	defer func() {
		_ = outFile.Close()
	}()

	var privateKey = &pem.Block{
		Type:  "PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(key),
	}

	err = pem.Encode(outFile, privateKey)
	if err != nil {
		return err
	}
	return nil
}
