package main

import (
	"log"
	"path/filepath"
	"strconv"

	"github.com/mreider/koto/central"
	"github.com/mreider/koto/central/migrate"
	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
	"github.com/mreider/koto/token"
)

func main() {
	port, err := strconv.Atoi("PORT")
	if err != nil {
		port = 12001
	}

	dbPath := filepath.Join(".", "central.db")
	db, n, err := common.OpenDatabase(dbPath, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, dbPath)

	privateKey, publicKey, publicKeyPEM, err := token.RSAKeysFromPrivateKeyFile("central.rsa")
	if err != nil {
		log.Fatalln(err)
	}

	tokenGenerator := token.NewGenerator(privateKey)
	tokenParser := token.NewParser(publicKey)

	repos := central.Repos{
		User:      repo.NewUsers(db),
		Relations: repo.NewRelations(db),
	}

	services := central.Services{
		Info:   service.NewInfo(string(publicKeyPEM)),
		User:   service.NewUser(repos.User, tokenGenerator),
		Invite: service.NewInvite(repos.User, repos.Relations, tokenGenerator, tokenParser),
	}

	server := central.NewServer(port, services, repos)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}
