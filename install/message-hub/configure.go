package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/AlecAivazis/survey/v2"

	"github.com/mreider/koto/install/common"
)

func configure(envPath string) (externalAddress string, dockerizedMinio bool, err error) {
	err = survey.AskOne(&survey.Input{
		Message: `Hub Address`,
	}, &externalAddress, survey.WithValidator(survey.Required))
	if err != nil {
		return "", false, err
	}

	ip := net.ParseIP(externalAddress)
	if ip != nil {
		externalAddress = ip.String() + ".sslip.io"
	}

	externalAddress = common.PrependHTTPS(externalAddress)

	postgresCfg, err := common.ConfigurePostgres("message_hub")
	if err != nil {
		return "", false, fmt.Errorf("can't configure Postgres: %w", err)
	}

	fmt.Println("")

	s3Cfg, err := common.ConfigureS3("message-hub")
	if err != nil {
		return "", false, fmt.Errorf("can't configure S3: %w", err)
	}

	fmt.Println("")

	var acceptCodeOfConduct string
	err = survey.AskOne(&survey.Input{
		Message: `Type "YES" to accept Peacenik code of conduct https://about.peacenik.app/code-of-conduct`,
	}, &acceptCodeOfConduct)
	if err != nil || survey.ToLower(acceptCodeOfConduct) != "yes" {
		return "", false, errors.New("the code of conduct is not accepted")
	}

	var envContent bytes.Buffer
	addEnvItem(&envContent, "KOTO_EXTERNAL_ADDRESS", externalAddress)
	addEnvItem(&envContent, "KOTO_USER_HUB_ADDRESS", "https://central.peacenik.app")
	addEnvItem(&envContent, "KOTO_DB_HOST", postgresCfg.Host)
	addEnvItem(&envContent, "KOTO_DB_PORT", strconv.Itoa(postgresCfg.Port))
	if !postgresCfg.SSLRequired {
		addEnvItem(&envContent, "KOTO_DB_SSL_MODE", "disable")
	}
	addEnvItem(&envContent, "KOTO_DB_NAME", postgresCfg.DBName)
	addEnvItem(&envContent, "KOTO_DB_USER", postgresCfg.User)
	addEnvItem(&envContent, "KOTO_DB_PASSWORD", postgresCfg.Password)
	addEnvItem(&envContent, "KOTO_S3_ENDPOINT", s3Cfg.Endpoint)
	if s3Cfg.InsideDocker {
		addEnvItem(&envContent, "KOTO_S3_EXTERNAL_ENDPOINT", strings.TrimSuffix(externalAddress, "/")+"/s3")
	} else {
		addEnvItem(&envContent, "KOTO_S3_EXTERNAL_ENDPOINT", "")
	}
	addEnvItem(&envContent, "KOTO_S3_REGION", s3Cfg.Region)
	addEnvItem(&envContent, "KOTO_S3_KEY", s3Cfg.Key)
	addEnvItem(&envContent, "KOTO_S3_SECRET", s3Cfg.Secret)
	addEnvItem(&envContent, "KOTO_S3_BUCKET", s3Cfg.Bucket)
	if postgresCfg.InsideDocker {
		addEnvItem(&envContent, "VOLUME_DB", "./data/db")
	}
	if s3Cfg.InsideDocker {
		addEnvItem(&envContent, "VOLUME_MINIO", "./data/minio")
	}

	dockerComposeContent, err := downloadDockerComposeConfig()
	if err != nil {
		return "", false, err
	}

	if !postgresCfg.InsideDocker {
		dockerComposeContent = common.DockerCompose{}.RemoveServiceFromConfig(dockerComposeContent, "db")
	}
	if !s3Cfg.InsideDocker {
		dockerComposeContent = common.DockerCompose{}.RemoveServiceFromConfig(dockerComposeContent, "s3")
	}

	envDir := filepath.Dir(envPath)
	err = os.MkdirAll(envDir, 0700)
	if err != nil {
		return "", false, err
	}

	if postgresCfg.InsideDocker || s3Cfg.InsideDocker {
		dataDir := filepath.Join(envDir, "data")
		err = os.MkdirAll(dataDir, 0700)
		if err != nil {
			return "", false, err
		}

		if postgresCfg.InsideDocker {
			err = os.MkdirAll(filepath.Join(dataDir, "db"), 0700)
			if err != nil {
				return "", false, err
			}
		}
		if s3Cfg.InsideDocker {
			err = os.MkdirAll(filepath.Join(dataDir, "minio"), 0700)
			if err != nil {
				return "", false, err
			}
		}
	}

	err = os.WriteFile(filepath.Join(envDir, "docker-compose.yml"), []byte(dockerComposeContent), 0644)
	if err != nil {
		return "", false, err
	}

	err = os.WriteFile(envPath, envContent.Bytes(), 0644)
	if err != nil {
		return "", false, err
	}

	return externalAddress, s3Cfg.InsideDocker, nil
}

func addEnvItem(content *bytes.Buffer, key, value string) {
	content.WriteString(key)
	content.WriteRune('=')
	content.WriteString(value)
	content.WriteRune('\n')
}

func downloadDockerComposeConfig() (string, error) {
	resp, err := http.Get("https://raw.githubusercontent.com/KotoLLC/peacenik/master/docker/message-hub/docker-compose.yml")
	if err != nil {
		return "", err
	}
	defer func() { _ = resp.Body.Close() }()

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

func createCaddyConfig(externalAddress string, dockerizedMinio bool) error {
	f, err := os.CreateTemp("", "")
	if err != nil {
		return err
	}
	defer func() {
		_ = f.Close()
		_ = os.Remove(f.Name())
	}()

	var b strings.Builder
	b.WriteString(externalAddress)
	b.WriteRune('\n')
	if dockerizedMinio {
		b.WriteString(`
route /s3* {
  uri strip_prefix /s3
  reverse_proxy localhost:9000
}

route /minio* {
  reverse_proxy localhost:9000
}
`)
	}

	b.WriteString(`
route {
  reverse_proxy localhost:12001
}
`)
	_, err = fmt.Fprintf(f, b.String())
	if err != nil {
		return err
	}

	err = f.Close()
	if err != nil {
		return err
	}

	err = common.ExecCmd("/bin/sh", "-c", "sudo mkdir -p /etc/caddy && sudo mv \""+f.Name()+"\" /etc/caddy/Caddyfile")
	if err != nil {
		return err
	}

	err = common.ExecCmd("/bin/sh", "-c", "sudo chown caddy /etc/caddy/Caddyfile")
	if err != nil {
		return err
	}
	return nil
}
