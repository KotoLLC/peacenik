package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

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

	db, n, err := common.OpenDatabase(cfg.DBPath, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, cfg.DBPath)

	s3Storage, err := cfg.S3.CreateStorage(context.TODO())
	if err != nil {
		log.Fatalln(err)
	}

	privateKey, _, publicKeyPEM, err := token.RSAKeysFromPrivateKeyFile(cfg.PrivateKeyPath)
	if err != nil {
		log.Fatalln(err)
	}

	tokenGenerator := token.NewGenerator(privateKey)

	repos := repo.Repos{
		User:   repo.NewUsers(db),
		Invite: repo.NewInvites(db),
		Friend: repo.NewFriends(db),
		Node:   repo.NewNodes(db),
	}

	server := central.NewServer(cfg, string(publicKeyPEM), repos, tokenGenerator, s3Storage)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}

func loadConfig(execDir string) (config.Config, error) {
	var configPath string
	var listenAddress string
	var dbPath string
	var privateKeyPath string
	var adminList string
	var tokenDurationSeconds int

	flag.StringVar(&configPath, "config", "central-config.yml", "config path")
	flag.StringVar(&listenAddress, "address", "", "http address to listen")
	flag.StringVar(&dbPath, "db", "", "path to Sqlite DB file")
	flag.StringVar(&privateKeyPath, "key", "", "path to private key file")
	flag.StringVar(&adminList, "admin", "", "administrator names (comma-separated)")
	flag.IntVar(&tokenDurationSeconds, "token-duration", 0, "token duration (seconds)")
	flag.Parse()

	if !filepath.IsAbs(configPath) {
		configPath = filepath.Join(execDir, configPath)
	}

	var cfg config.Config
	data, err := ioutil.ReadFile(configPath)
	if err != nil && !os.IsNotExist(err) {
		return config.Config{}, fmt.Errorf("can't read config file: %w", err)
	} else if err == nil {
		cfg, err = config.Read(bytes.NewReader(data))
		if err != nil {
			return config.Config{}, err
		}
	}

	if listenAddress != "" {
		cfg.ListenAddress = listenAddress
	}
	if dbPath != "" {
		cfg.DBPath = dbPath
	}
	if privateKeyPath != "" {
		cfg.PrivateKeyPath = privateKeyPath
	}
	if adminList != "" {
		var admins []string
		for _, admin := range strings.Split(adminList, ",") {
			admin = strings.TrimSpace(admin)
			if admin != "" {
				admins = append(admins, admin)
			}
		}
		cfg.Admins = admins
	}
	if tokenDurationSeconds != 0 {
		cfg.TokenDurationSeconds = tokenDurationSeconds
	}

	return cfg, nil
}
