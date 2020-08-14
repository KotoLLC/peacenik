# Running / testing a node

You can run a node locally for testing purposes. There are no unit tests. We'd gladly thank you for your time if you'd like to write some.

## Running node, central, and front end via docker-compose

You can run both services locally from the root directory with:
`docker-compose up`

## Running a node from source

### Build

```
go build -o node-service ./node/cmd/
```

### Configure

Rename `node-config.yml.example` to `node-12002-config.yml` and change values.

```yaml
address: :12002
external_address: http://localhost:12002
central_address: http://localhost:12001

db:
  host: localhost
  port: 5432
  ssl_mode: disable
  user: postgres
  password: docker
  db_name: koto-node-12002

s3:
  endpoint: http://127.0.0.1:9010
  region:
  key: minioadmin
  secret: minioadmin
  bucket: koto-node-12002

``` 

### Run

```
./node-service -config node-12002-config.yml
```