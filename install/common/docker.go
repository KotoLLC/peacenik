package common

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os/exec"
	"regexp"
	"time"
)

var (
	dockerVersionRe = regexp.MustCompile(`Docker version ([^,]+),`)
)

type Docker struct{}

func (Docker) Version() (version string, err error) {
	_, err = exec.LookPath("docker")
	if err != nil {
		return "", nil
	}

	cmd := exec.Command("docker", "--version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}
	m := dockerVersionRe.FindSubmatch(output)
	if m != nil {
		return string(m[1]), nil
	}
	return "", nil
}

func (Docker) Install() error {
	fmt.Println("Installing Docker...")

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	resp, err := client.Get("https://get.docker.com")
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

	f, err := ioutil.TempFile("", "*-get-docker.sh")
	if err != nil {
		return err
	}
	_, err = io.Copy(f, resp.Body)
	_ = f.Close()
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", f.Name())
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", "-c", "sudo usermod -aG docker $USER")
	if err != nil {
		return err
	}
	return nil
}
