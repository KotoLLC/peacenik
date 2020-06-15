# Generate RSA key

```
openssl genrsa -out central.rsa 1024
```

# Build

```
go build -o central-service ./central/cmd/
```

# Run

```
./central-service -address ":12001" -db central.db -key central.rsa
```

# API

```
### Get the public key to check token signatures
GET http://localhost:12001/info/publicKey


### Register a new user
POST http://localhost:12001/auth/register
Content-Type: application/json

{"name":  "andrey", "email": "andrey@mail.com", "password":  "12345"}


### Login
POST http://localhost:12001/auth/login
Content-Type: application/json

{"email": "andrey@mail.com", "password":  "12345"}


### Get a short-lived signed authentication token
POST http://localhost:12001/token/auth


### Logout
POST http://localhost:12001/auth/logout


### Create invite.
POST http://localhost:12001/invite/create
Content-Type: application/json

{"whom": "andrey@mail.com"}


### Accept invite.
POST http://localhost:12001/invite/accept
Content-Type: application/json

{
  "token": "INVITE-TOKEN"
}


### List of friends (for current user).
POST http://localhost:12001/friends


### List of "post messages" nodes (for current user).
POST http://localhost:12001/nodes/postMessages


### List of "get messages" nodes (for current user).
POST http://localhost:12001/nodes/getMessages


### Get a short-lived signed "post message" token
POST http://localhost:12001/token/postMessage
Content-Type: application/json

{"nodes":  ["http://localhost:12002", "http://localhost:12003"]}


### Get a short-lived signed "get messages" token
POST http://localhost:12001/token/getMessages
Content-Type: application/json

{"nodes":  ["http://localhost:12002", "http://localhost:12003"]}

```