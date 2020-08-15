# Message Hub installation

## Prerequisites

* [docker](https://docs.docker.com/engine/install/ubuntu/)
* [docker-compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)
* [Caddy](https://caddyserver.com/docs/download#debian-ubuntu-raspbian)

# First run

## 1. Create a new folder: 

`mkdir ~/koto-hub`

## 2. Go to the new folder:   

`cd ~/koto-hub`

## 3. Download `docker-compose.yml` and `.env.template` files:

```
curl https://raw.githubusercontent.com/mreider/koto/master/docker/message-hub/docker-compose.yml -O
curl https://raw.githubusercontent.com/mreider/koto/master/docker/message-hub/.env.template -O
```

## 4. Copy `.env.template` file to `.env` file:

`cp .env.template .env`

## 5. Fill/modify values in `.env` file:

`nano .env`

Sample:
```
KOTO_EXTERNAL_ADDRESS=https://node12345.koto.at
KOTO_USER_HUB_ADDRESS=https://central.koto.at
KOTO_DB_NAME=koto-message-hub
KOTO_DB_USER=postgres
KOTO_DB_PASSWORD=dockerK0T0postgres
KOTO_S3_ENDPOINT=ams3.digitaloceanspaces.com
KOTO_S3_REGION=
KOTO_S3_KEY=qwerty
KOTO_S3_SECRET=asdfg
KOTO_S3_BUCKET=koto-message-hub-bucket
VOLUME_HUB=/mnt/volume_04/hub
VOLUME_DB=/mnt/volume_04/db
```

## 6. Start hub and db containers

```
docker-compose pull
docker-compose up -d
```

## 7. Setup Caddy

### 7.1 Configure Caddy  

Modify `/etc/caddy/Caddyfile` content:

`sudo nano /etc/caddy/Caddyfile` 

Sample:
```
node1.koto.at

route {
  reverse_proxy localhost:12001
}
```

### 7.2 Reload Caddy configuration

`sudo systemctl reload caddy`

# Update

## 1. Go to the hub folder:   

`cd ~/koto-hub`

## 2. Download `docker-compose.yml` and `.env.template` files:

```
curl https://raw.githubusercontent.com/mreider/koto/master/docker/message-hub/docker-compose.yml -O
curl https://raw.githubusercontent.com/mreider/koto/master/docker/message-hub/.env.template -O
```

## 3. Update .env file for new variables

Execute command:

`docker-compose build`

If you see warnings (like `WARNING: The KOTO_S3_ENDPOINT variable is not set. Defaulting to a blank string.`), edit .env file (`nano .env`) and set values for new variables.

## 4. Restart hub and db containers

```
docker-compose pull
docker-compose up -d
```
