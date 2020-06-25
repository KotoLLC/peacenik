package main

import (
	"crypto/rsa"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node"
	"github.com/mreider/koto/backend/node/migrate"
	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/token"
)

var (
	portRegex = regexp.MustCompile(`:(\d+)`)
)

func main() {
	var internalAddress string
	var externalAddress string
	var dbPath string
	var centralServerAddress string

	flag.StringVar(&internalAddress, "address", ":12002", "http address to listen")
	flag.StringVar(&externalAddress, "external", "http://localhost:12002", "external http address")
	flag.StringVar(&dbPath, "db", "", "path to Sqlite DB file")
	flag.StringVar(&centralServerAddress, "central", "http://localhost:12001", "central server address")
	flag.Parse()

	if dbPath == "" {
		match := portRegex.FindStringSubmatch(internalAddress)
		if match == nil {
			log.Fatalf("can't determine port in the listen address '%s'\n", internalAddress)
		}
		dbPath = "node" + match[1] + ".db"
	}

	centralServerAddress = strings.TrimSuffix(centralServerAddress, "/")
	if centralServerAddress == "" {
		log.Fatalln("central server address should be specified")
	}

	db, n, err := common.OpenDatabase(dbPath, migrate.Migrate)
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Applied %d migrations to %s\n", n, dbPath)

	centralPublicKey, err := loadCentralPublicKey(centralServerAddress)
	if err != nil {
		log.Fatalln(err)
	}

	tokenParser := token.NewParser(centralPublicKey)
	repos := repo.Repos{
		Message: repo.NewMessages(db),
	}

	server := node.NewServer(internalAddress, externalAddress, repos, tokenParser)
	err = server.Run()
	if err != nil {
		log.Fatalln(err)
	}
}

func loadCentralPublicKey(centralServerAddress string) (*rsa.PublicKey, error) {
	client := &http.Client{
		Timeout: time.Second * 30,
	}

	resp, err := client.Post(centralServerAddress+"/rpc.InfoService/PublicKey", "application/json", strings.NewReader("{}"))
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()

	var body struct {
		PublicKey string `json:"public_key"`
	}
	err = json.NewDecoder(resp.Body).Decode(&body)
	if err != nil {
		return nil, err
	}
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(body.PublicKey))
	if err != nil {
		return nil, err
	}
	return key, nil
}
