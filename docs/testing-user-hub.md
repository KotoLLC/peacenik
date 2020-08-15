# Running / testing a user hub service

## Running both message and user hubs via docker-compose

You can run both services locally from the root directory with:
`docker-compose up`

## Running the user hub from source

### Build user hub

```
go build -o user-hub-service ./userhub/cmd/
```

### Configure

Rename `user-hub-config.yml.example` to `user-hub-config.yml` and change values.

```yaml
address: :12001
private_key_path: user-hub.rsa
admins:
  - admin@mail.org
token_duration: 3600

db:
  host: localhost
  port: 5432
  ssl_mode: disable
  user: postgres
  password: docker
  db_name: koto-user-hub

s3:
  endpoint: http://127.0.0.1:9000
  region:
  key: minioadmin
  secret: minioadmin
  bucket: koto-user-hub

smtp:
  host: smtp.mailtrap.io
  port: 587
  user: 23423423423423
  password: 4534534terer
  from: admin@koto.org

``` 

### Run

#### Minio (for S3 testing)
```
docker run --name minio-koto -p 9000:9000 -e MINIO_ACCESS_KEY=minioadmin -e MINIO_SECRET_KEY=minioadmin -d minio/minio server /data
```

#### Postgres
```
docker run --name koto-user-hub-db -d -p 5432:5432 -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=koto-user-hub -d postgres
```

#### Run User Hub
```
./user-hub-service -config user-hub-config.yml
```

#### Run frontend user interface

```
cd frontend
npm install
npm run build
npm install -g serve
serve -s build &
```


## Tests

Tests are run using [newman](https://www.npmjs.com/package/newman) - a command line tool for Postman formatted rest calls.

### Install newman

`npm install -g newman`

### Run tests

`newman run requests.json`
