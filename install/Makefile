build:
	GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o ./message-hub-installer ./message-hub

package:
	tar -czvf message-hub-installer.tar.gz ./message-hub-installer
