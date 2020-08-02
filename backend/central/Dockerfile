FROM golang:1.14-alpine as builder

COPY go.mod /service/
COPY go.sum /service/

WORKDIR /service

RUN go mod download

COPY token/*.go ./token/
COPY common/*.go ./common/

COPY central/ ./central/

RUN GOOS=linux GOARCH=amd64 go build -o central-service ./central/cmd/

FROM alpine

COPY --from=builder /service/central-service /service/central-service

WORKDIR /service

ENTRYPOINT ["./central-service"]