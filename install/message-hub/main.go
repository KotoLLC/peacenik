package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/mreider/koto/install/common"
)

func main() {
	fmt.Println(`Peacenik message hub installation.

This script will install the following:
- Docker and Docker compose
- Caddy (https://caddyserver.com/)
- Peacenik message hub`)

	fmt.Println("")

	userDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatalln(err)
	}
	peacenikDir := filepath.Join(userDir, "peacenik")
	envPath := filepath.Join(peacenikDir, ".env")
	var externalAddress string
	var dockerizedMinio bool
	if _, err := os.Stat(envPath); err != nil {
		if os.IsNotExist(err) {
			externalAddress, dockerizedMinio, err = configure(envPath)
			if err != nil {
				log.Fatalln(err)
			}
		} else {
			log.Fatalln(err)
		}
	}

	docker := common.Docker{}
	dockerVersion, err := docker.Version()
	if err != nil {
		log.Fatalln("can't check Docker version:", err)
	}

	if dockerVersion == "" {
		err = docker.Install()
		if err != nil {
			log.Fatalln("can't install Docker:", err)
		}
		dockerVersion, err = docker.Version()
		if err != nil {
			log.Fatalln("can't check Docker version:", err)
		}
	}

	println("Docker version:", dockerVersion)

	dockerCompose := common.DockerCompose{}
	dockerComposeVersion, err := dockerCompose.Version()
	if err != nil {
		log.Fatalln("can't check Docker Compose version:", err)
	}

	if dockerComposeVersion < "1.23" {
		err = dockerCompose.Install(dockerComposeVersion)
		if err != nil {
			log.Fatalln("can't install Docker Compose:", err)
		}
		dockerComposeVersion, err = dockerCompose.Version()
		if err != nil {
			log.Fatalln("can't check Docker Compose version:", err)
		}
	}
	println("Docker Compose version:", dockerComposeVersion)

	caddy := common.Caddy{}
	caddyVersion, err := caddy.Version()
	if err != nil {
		log.Fatalln("can't check Caddy version:", err)
	}

	if caddyVersion == "" {
		err = caddy.Install()
		if err != nil {
			log.Fatalln("can't install Caddy:", err)
		}
		caddyVersion, err = caddy.Version()
		if err != nil {
			log.Fatalln("can't check Caddy version:", err)
		}
	}

	println("Caddy version:", caddyVersion)

	if externalAddress != "" {
		err := createCaddyConfig(externalAddress, dockerizedMinio)
		if err != nil {
			log.Fatalln("can't create Caddy config:", err)
		}

		err = caddy.Restart()
		if err != nil {
			log.Fatalln("can't restart Caddy:", err)
		}
	}

	err = dockerCompose.PullImages(peacenikDir)
	if err != nil {
		log.Fatalln("can't pull docker images:", err)
	}

	err = dockerCompose.Up(peacenikDir)
	if err != nil {
		log.Fatalln("can't start docker containers:", err)
	}
}
