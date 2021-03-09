package common

import (
	"os"
	"os/exec"
	"strings"
)

func PrependHTTPS(address string) string {
	if strings.HasPrefix(address, "http://") || strings.HasPrefix(address, "https://") {
		return address
	}
	return "https://" + address
}

func ExecCmd(name string, arg ...string) error {
	return ExecCmdInDir("", name, arg...)
}

func ExecCmdInDir(dir, name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	cmd.Dir = dir
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
