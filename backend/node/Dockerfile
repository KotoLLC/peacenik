FROM golang:1.14-alpine as builder

COPY go.mod /service/
COPY go.sum /service/

WORKDIR /service

RUN go mod download

COPY token/*.go ./token/
COPY common/*.go ./common/

COPY node/ ./node/

RUN GOOS=linux GOARCH=amd64 go build -o node-service ./node/cmd/

FROM alpine

COPY --from=builder /service/node-service /service/node-service

WORKDIR /service

ENTRYPOINT ["./node-service"]
