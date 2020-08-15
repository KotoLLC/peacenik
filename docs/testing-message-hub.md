# Running / testing a message hub

You can run a message hub locally for testing purposes. There are no unit tests. We'd gladly thank you for your time if you'd like to write some.

## Running message and user hubs, and front end via docker-compose

You can run both services locally from the root directory with:
`docker-compose up`

## Running a message hub from source

### Build

```
go build -o message-hub-service ./messagehub/cmd/
```

### Configure

Rename `message-hub-config.yml.example` to `message-hub-12002-config.yml` and change values.

```yaml
address: :12002
external_address: http://localhost:12002
user_hub_address: http://localhost:12001

db:
  host: localhost
  port: 5432
  ssl_mode: disable
  user: postgres
  password: docker
  db_name: koto-message-hub-12002

s3:
  endpoint: http://127.0.0.1:9010
  region:
  key: minioadmin
  secret: minioadmin
  bucket: koto-message-hub-12002

``` 

### Run

```
./message-hub-service -config message-hub-12002-config.yml
```
