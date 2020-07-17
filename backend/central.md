# Generate RSA key

```
openssl genrsa -out central.rsa 1024
```

# Build

```
go build -o central-service ./central/cmd/
```

# Configure

Rename `central-config.yml.example` to `central-config.yml` and change values.

```yaml
address: :12001
db: central.db
private_key_path: central.rsa
admins:
  - admin@mail.org
token_duration: 3600

s3:
  endpoint: http://127.0.0.1:9000
  region:
  key: minioadmin
  secret: minioadmin
  bucket: koto-central

``` 

# Run

## Minio (for S3 testing)
```
docker run --name minio-koto -p 9000:9000 -e MINIO_ACCESS_KEY=minioadmin -e MINIO_SECRET_KEY=minioadmin -d minio/minio server /data
```

## Central Service
```
./central-service
```

# API

## Server Public Key

```
### Get the public key to check token signatures
POST http://localhost:12001/rpc.InfoService/PublicKey
Content-Type: application/json

{}
```

## Registration

```
### Register a new user
POST http://localhost:12001/rpc.AuthService/Register
Content-Type: application/json

{"name":  "andrey", "email": "andrey@mail.com", "password":  "12345"}
```

## Authentication

```
### Login
POST http://localhost:12001/rpc.AuthService/Login
Content-Type: application/json

{"name": "andrey", "password":  "12345"}


### Get current user info.
POST http://localhost:12001/rpc.UserService/Me
Content-Type: application/json

{}


### Get a short-lived signed authentication token
POST http://localhost:12001/rpc.TokenService/Auth
Content-Type: application/json

{}

### Logout
POST http://localhost:12001/rpc.AuthService/Logout
Content-Type: application/json

{}
```

## Node Management

```
### Register a new node
POST http://localhost:12001/rpc.NodeService/Register
Content-Type: application/json

{
  "address": "http://localhost:12002",
  "details": "my cool node"
}


### Get all nodes (admin access) or my nodes
POST http://localhost:12001/rpc.NodeService/Nodes
Content-Type: application/json

{}


### Approve node (admin access)
POST http://localhost:12001/rpc.NodeService/Approve
Content-Type: application/json

{"node_id":  "e60b3ff4-9ac0-4ba4-a45c-626c4eb29f75"}


### Remove node
POST http://localhost:12001/rpc.NodeService/Remove
Content-Type: application/json

{"node_id":  "ba7c6e53-dfea-46ec-b0ff-208f984393c4"}
```

## Invites

```
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
```

## Friends

```
### List of friends (for current user).
POST http://localhost:12001/rpc.UserService/Friends
Content-Type: application/json

{}


### List of friends of friends (for current user).
POST http://localhost:12001/rpc.UserService/FriendsOfFriends
Content-Type: application/json

{}
```

## Tokens

```
### Get a short-lived signed "post message" token
POST http://localhost:12001/rpc.TokenService/PostMessage
Content-Type: application/json

{}


### Get a short-lived signed "get messages" token
POST http://localhost:12001/rpc.TokenService/GetMessages
Content-Type: application/json

{}
```

## Blobs

```
### Get blob upload link
POST http://localhost:12001/rpc.BlobService/UploadLink
Content-Type: application/json

{
  "content_type": "image/png"
}

```