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


### Get a signed invite token.
POST http://localhost:12001/invite/token
Content-Type: application/json

{"whom": "max@mail.com"}
```