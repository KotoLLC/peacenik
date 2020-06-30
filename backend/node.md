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

### Edit message
POST http://localhost:12002/rpc.MessageService/Edit
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4",
  "text": "updated message",
  "updated_at": "2020-06-29T11:11:11.111Z"
}

### Delete message
POST http://localhost:12002/rpc.MessageService/Delete
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4"
}

```