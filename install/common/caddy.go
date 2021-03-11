package common

import (
	"fmt"
	"os/exec"
	"regexp"
)

var (
	caddyVersionRe = regexp.MustCompile(`^v(\S+)\s`)
)

type Caddy struct{}

func (Caddy) Version() (version string, err error) {
	_, err = exec.LookPath("caddy")
	if err != nil {
		return "", nil
	}

	cmd := exec.Command("caddy", "version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}
	m := caddyVersionRe.FindSubmatch(output)
	if m != nil {
		return string(m[1]), nil
	}
	return "", nil
}

func (Caddy) Install() error {
	fmt.Println("Installing Caddy...")

	err := ExecCmd("/bin/sh", "-c", "sudo apt install -qq -y debian-keyring debian-archive-keyring apt-transport-https > /dev/null")
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", "-c", "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -")
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", "-c", "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list")
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", "-c", "sudo apt update -qq > /dev/null")
	if err != nil {
		return err
	}

	err = ExecCmd("/bin/sh", "-c", "sudo apt install -qq caddy")
	if err != nil {
		return err
	}

	return nil
}

func (Caddy) Restart() error {
	return ExecCmd("/bin/sh", "-c", "sudo systemctl reload caddy")
}
