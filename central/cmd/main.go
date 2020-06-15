package main

import (
	"flag"
	"log"

	"github.com/mreider/koto/central"
	"github.com/mreider/koto/central/migrate"
	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
	"github.com/mreider/koto/token"
)

func main() {
	var listenAddress string
	var dbPath string
	var privateKeyPath string

	flag.StringVar(&listenAddress, "address", ":12001", "http address to listen")
	flag.StringVar(&dbPath, "db", "central.db", "path to Sqlite DB file")
	flag.StringVar(&privateKeyPath, "key", "central.rsa", "path to private key file")
	flag.Parse()

	db, n, err := common.OpenDatabase(dbPath, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, dbPath)

	privateKey, publicKey, publicKeyPEM, err := token.RSAKeysFromPrivateKeyFile(privateKeyPath)
	if err != nil {
		log.Fatalln(err)
	}

	tokenGenerator := token.NewGenerator(privateKey)
	tokenParser := token.NewParser(publicKey)

	repos := central.Repos{
		User:   repo.NewUsers(db),
		Invite: repo.NewInvites(db),
		Friend: repo.NewFriends(db),
		Node:   repo.NewNodes(db),
	}

	services := central.Services{
		Info:   service.NewInfo(string(publicKeyPEM)),
		User:   service.NewUser(repos.User, tokenGenerator),
		Invite: service.NewInvite(repos.User, repos.Invite, tokenGenerator, tokenParser),
		Token:  service.NewToken(repos.Node, tokenGenerator),
		Node:   service.NewNode(repos.Node),
	}

	server := central.NewServer(listenAddress, services, repos)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}
