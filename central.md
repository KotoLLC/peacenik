# Generate RSA key

```
openssl genrsa -out central.rsa 1024
```

# Build

```
go build -o central-service ./central/cmd/ && ./central-service
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
POST http://localhost:12001/auth/token


### Logout
POST http://localhost:12001/auth/logout


### Create invite.
POST http://localhost:12001/invite/create
Content-Type: application/json

{"whom": "andrey@mail.com", "community": "http://localhost:12002"}


### Accept invite.
POST http://localhost:12001/invite/accept
Content-Type: application/json

{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21tdW5pdHkiOiJodHRwOi8vbG9jYWxob3N0OjEyMDAyIiwiZXhwIjoxNTkyNTc1NTUzLCJpZCI6IjM1ZjM1NjU2LTliN2MtNDkyOS1iM2VmLTRjYmFkMjI2NDE2NCIsIm5hbWUiOiJhbmRyZXk5Iiwic2NvcGUiOiJpbnZpdGUiLCJ3aG9tIjoiYW5kcmV5QG1haWwuY29tIn0.if9Ap2wm1dsKZBxXJcY5HFlli1AkxDMUZoz-gTs75QQjolTMMVwc0es_DGD05A3yq-IneDXMoz9POXReYcbpA_NfAfIXn-DqYZ6Q0CKlw-fYaxUSYy5c2C8e0Mg0QCJJmqQcmSZrkB_eWfreS8AS-GGCgB-J4dCeILh9U1heZgQ"
}
```