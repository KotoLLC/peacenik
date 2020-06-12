package main

import (
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"
	"log"
	"path/filepath"
	"strconv"

	"github.com/dgrijalva/jwt-go"

	"github.com/mreider/koto/central"
	"github.com/mreider/koto/central/migrate"
	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/central/token"
	"github.com/mreider/koto/common"
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

	privateKeyBytes, err := ioutil.ReadFile("central.rsa")
	if err != nil {
		log.Fatalln(err)
	}
	privateKey, err := jwt.ParseRSAPrivateKeyFromPEM(privateKeyBytes)
	if err != nil {
		log.Fatalln(err)
	}

	publicKeyDer, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		log.Fatalln(err)
	}
	pubKeyBlock := pem.Block{
		Type:    "PUBLIC KEY",
		Headers: nil,
		Bytes:   publicKeyDer,
	}
	pubKeyPem := string(pem.EncodeToMemory(&pubKeyBlock))

	tokenGenerator := token.NewGenerator(privateKey)

	repos := central.Repos{
		User: repo.NewUsers(db),
	}

	services := central.Services{
		Info:   service.NewInfo(pubKeyPem),
		User:   service.NewUser(repos.User, tokenGenerator),
		Invite: service.NewInvite(repos.User, tokenGenerator),
	}

	server := central.NewServer(port, services, repos)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}
