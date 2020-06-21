package main

import (
	"flag"
	"log"
	"strings"

	"github.com/mreider/koto/backend/central"
	"github.com/mreider/koto/backend/central/migrate"
	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
)

func main() {
	var listenAddress string
	var dbPath string
	var privateKeyPath string
	var adminList string

	flag.StringVar(&listenAddress, "address", ":12001", "http address to listen")
	flag.StringVar(&dbPath, "db", "central.db", "path to Sqlite DB file")
	flag.StringVar(&privateKeyPath, "key", "central.rsa", "path to private key file")
	flag.StringVar(&adminList, "admin", "", "administrator names (comma-separated)")
	flag.Parse()

	admins := make(map[string]bool)
	for _, admin := range strings.Split(adminList, ",") {
		admin = strings.TrimSpace(admin)
		if admin != "" {
			admins[admin] = true
		}
	}

	db, n, err := common.OpenDatabase(dbPath, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, dbPath)

	privateKey, _, publicKeyPEM, err := token.RSAKeysFromPrivateKeyFile(privateKeyPath)
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

	server := central.NewServer(listenAddress, string(publicKeyPEM), admins, repos, tokenGenerator)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}
