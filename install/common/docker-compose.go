package common

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

var (
	dockerComposeVersionRe = regexp.MustCompile(`docker-compose version ([^,]+),`)
)

type DockerCompose struct{}

func (DockerCompose) Version() (version string, err error) {
	_, err = exec.LookPath("docker-compose")
	if err != nil {
		return "", nil
	}

	cmd := exec.Command("docker-compose", "--version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}
	m := dockerComposeVersionRe.FindSubmatch(output)
	if m != nil {
		return string(m[1]), nil
	}
	return "", nil
}

func (DockerCompose) Install(currentVersion string) error {
	if currentVersion == "" {
		fmt.Println("Installing Docker Compose...")
	} else {
		fmt.Println("Updating Docker Compose...")
	}

	client := &http.Client{
		Timeout: time.Second * 600,
	}
	resp, err := client.Get("https://github.com/docker/compose/releases/download/1.28.5/docker-compose-Linux-x86_64")
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

	f, err := ioutil.TempFile("", "*-docker-compose")
	if err != nil {
		return err
	}
	_, err = io.Copy(f, resp.Body)
	_ = f.Close()
	if err != nil {
		return err
	}

	return ExecCmd("/bin/sh", "-c", "sudo mv \""+f.Name()+"\" /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose")
}

func (DockerCompose) PullImages(baseDir string) error {
	return ExecCmdInDir(baseDir, "/bin/sh", "-c", "sudo docker-compose pull")
}

func (DockerCompose) Up(baseDir string) error {
	return ExecCmdInDir(baseDir, "/bin/sh", "-c", "sudo docker-compose up -d")
}

func (DockerCompose) RemoveServiceFromConfig(config, service string) string {
	lines := strings.Split(config, "\n")
	i := 0
	result := make([]string, 0, len(lines))
	inDependsOn, inService := false, false
	var dependsOnLines []string
	for i < len(lines) {
		line := strings.TrimSpace(lines[i])
		switch {
		case line == "":
			if inDependsOn && len(dependsOnLines) > 1 {
				result = append(result, dependsOnLines...)
			}
			if !inService {
				result = append(result, lines[i])
			}
			inDependsOn, inService = false, false
		case inDependsOn:
			if line != "- "+service {
				dependsOnLines = append(dependsOnLines, lines[i])
			}
		case inService:
		default:
			inDependsOn = line == "depends_on:"
			inService = line == service+":"
			if !inService && !inDependsOn {
				result = append(result, lines[i])
			}
			if inDependsOn {
				dependsOnLines = []string{lines[i]}
			}
		}
		i++
	}

	return strings.Join(result, "\n")
}
