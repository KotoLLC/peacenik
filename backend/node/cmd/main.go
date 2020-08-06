package main

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node"
	"github.com/mreider/koto/backend/node/config"
	"github.com/mreider/koto/backend/node/migrate"
	"github.com/mreider/koto/backend/node/repo"
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

	var keyMu sync.Mutex
	var centralPublicKey *rsa.PublicKey
	tokenParser := token.NewParser(func() *rsa.PublicKey {
		keyMu.Lock()
		defer keyMu.Unlock()

		if centralPublicKey != nil {
			return centralPublicKey
		}

		key, err := loadCentralPublicKey(context.TODO(), cfg.CentralServerAddress)
		if err != nil {
			log.Println("can't load central public key:", err)
			return nil
		}
		centralPublicKey = key
		return centralPublicKey
	})
	repos := repo.Repos{
		Message:      repo.NewMessages(db),
		Notification: common.NewNotifications(db),
		User:         repo.NewUsers(db),
	}

	s3Cleaner := common.NewS3Cleaner(db, s3Storage)
	go s3Cleaner.Clean(context.Background())

	server := node.NewServer(cfg, repos, tokenParser, s3Storage)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}

func loadCentralPublicKey(ctx context.Context, centralServerAddress string) (*rsa.PublicKey, error) {
	client := &http.Client{
		Timeout: time.Second * 30,
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, centralServerAddress+"/rpc.InfoService/PublicKey", strings.NewReader("{}"))
	if err != nil {
		return nil, merry.Wrap(err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, merry.Errorf("unexpected response status %s", resp.Status)
	}

	var body struct {
		PublicKey string `json:"public_key"`
	}
	err = json.NewDecoder(resp.Body).Decode(&body)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(body.PublicKey))
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return key, nil
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

	if cfg.CentralServerAddress != "" {
		cfg.CentralServerAddress = strings.TrimSuffix(cfg.CentralServerAddress, "/")
	}

	return cfg, nil
}
