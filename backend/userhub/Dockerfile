FROM golang:1.16-alpine as builder
RUN apk add build-base

COPY go.mod /service/
COPY go.sum /service/

WORKDIR /service

RUN go mod download

COPY statik/*.go ./statik/
COPY token/*.go ./token/
COPY common/*.go ./common/

COPY userhub/ ./userhub/

RUN GOOS=linux GOARCH=amd64 go build -ldflags '-linkmode=external' -o user-hub-service ./userhub/cmd/

FROM alpine

COPY --from=builder /service/user-hub-service /service/user-hub

WORKDIR /service

ENTRYPOINT ["./user-hub"]
