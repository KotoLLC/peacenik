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
./central-service -address ":12001" -db central.db -key central.rsa -admin admin@mail.org
```

# API

```
### Get the public key to check token signatures
POST http://localhost:12001/rpc.InfoService/PublicKey
Content-Type: application/json

{}


### Register a new user
POST http://localhost:12001/rpc.AuthService/Register
Content-Type: application/json

{"name":  "andrey", "email": "andrey@mail.com", "password":  "12345"}


### Login
POST http://localhost:12001/rpc.AuthService/Login
Content-Type: application/json

{"name": "andrey", "password":  "12345"}


### Get a short-lived signed authentication token
POST http://localhost:12001/rpc.TokenService/Auth
Content-Type: application/json

{}

### Logout
POST http://localhost:12001/rpc.AuthService/Logout
Content-Type: application/json

{}


### Register a new node
POST http://localhost:12001/rpc.NodeService/Register
Content-Type: application/json

{
  "address": "http://localhost:12002"
}


### Get all nodes (admin access)
POST http://localhost:12001/rpc.NodeService/Nodes
Content-Type: application/json

{}


### Approve node (admin access)
POST http://localhost:12001/rpc.NodeService/Approve
Content-Type: application/json

{"node_id":  "e60b3ff4-9ac0-4ba4-a45c-626c4eb29f75"}


### Create invite.
POST http://localhost:12001/rpc.InviteService/Create
Content-Type: application/json

{"friend": "andrey@mail.com"}


### Get invites from me.
POST http://localhost:12001/rpc.InviteService/FromMe
Content-Type: application/json

{}


### Get invites for me.
POST http://localhost:12001/rpc.InviteService/ForMe
Content-Type: application/json

{}


### Accept invite.
POST http://localhost:12001//rpc.InviteService/Accept
Content-Type: application/json

{
  "inviter_id": "USER-ID"
}


### Reject invite.
POST http://localhost:12001//rpc.InviteService/Reject
Content-Type: application/json

{
  "inviter_id": "USER-ID"
}


### List of friends (for current user).
POST http://localhost:12001/rpc.UserService/Friends
Content-Type: application/json

{}


### List of friends of friends (for current user).
POST http://localhost:12001/rpc.UserService/FriendsOfFriends
Content-Type: application/json

{}


### Get a short-lived signed "post message" token
POST http://localhost:12001/rpc.TokenService/PostMessage
Content-Type: application/json

{}


### Get a short-lived signed "get messages" token
POST http://localhost:12001/rpc.TokenService/GetMessages
Content-Type: application/json

{}

```