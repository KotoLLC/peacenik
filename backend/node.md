# Build

```
go build -o node-service ./node/cmd/
```

# Run

```
./node-service -address ":12002" -external "http://localhost:12002" -db node12002.db -central "http://localhost:12001"
```

# API

```
### Post a message
POST http://localhost:12002/rpc.MessageService/Post
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "POST-MESSAGE-TOKEN",
  "message": {
    "id": "2",
    "text": "second message",
    "created_at": "2020-06-12T10:16:40.335Z",
    "updated_at": "2020-06-12T10:16:40.335Z"
  }
}


### Get messages
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN
}
```