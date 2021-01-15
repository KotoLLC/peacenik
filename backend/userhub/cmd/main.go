package main

import (
	"context"
	"crypto/rsa"
	"flag"
	"log"
	"os"
	"path/filepath"

	"github.com/ansel1/merry"
	"github.com/rakyll/statik/fs"

	"github.com/mreider/koto/backend/common"
	_ "github.com/mreider/koto/backend/statik"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub"
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/migrate"
	"github.com/mreider/koto/backend/userhub/repo"
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

	repos := repo.NewRepos(db)
	userCache := caches.NewUsers(db)

	privateKeyContent, err := common.LoadRSAKey(repos.Setting, cfg.PrivateKeyPath)
	if err != nil {
		log.Fatalln(err)
	}

	privateKey, publicKey, publicKeyPEM, err := common.RSAKeysFromPrivateKeyContent(privateKeyContent)
	if err != nil {
		log.Fatalln(err)
	}

	tokenGenerator := token.NewGenerator(privateKey)
	tokenParser := token.NewParser(func() *rsa.PublicKey {
		return publicKey
	})

	s3Cleaner := common.NewS3Cleaner(db, s3Storage)
	go s3Cleaner.Clean(context.Background())

	staticFS, err := fs.New()
	if err != nil {
		log.Fatalln(err)
	}

	confirmAdminUsers(repos.User, cfg)

	server := userhub.NewServer(cfg, string(publicKeyPEM), repos, userCache, tokenGenerator, tokenParser, s3Storage, staticFS)
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

func confirmAdminUsers(userRepo repo.UserRepo, cfg config.Config) {
	for _, userName := range cfg.AdminList() {
		user := userRepo.FindUserByName(userName)
		if user != nil && !user.ConfirmedAt.Valid {
			log.Println("Auto-confirm an admin:", userName)
			userRepo.ConfirmUser(user.ID)
		}
	}
}
