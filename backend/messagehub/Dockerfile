FROM golang:1.14-alpine as builder

COPY go.mod /service/
COPY go.sum /service/

WORKDIR /service

RUN go mod download

COPY token/*.go ./token/
COPY common/*.go ./common/

COPY ./messagehub/ ./messagehub/

RUN GOOS=linux GOARCH=amd64 go build -o message-hub-service ./messagehub/cmd/

FROM jrottenberg/ffmpeg:3.4-alpine

COPY --from=builder /service/message-hub-service /service/message-hub

WORKDIR /service

ENTRYPOINT ["./message-hub"]
