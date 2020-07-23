# Build

```
go build -o node-service ./node/cmd/
```

# Configure

Rename `node-config.yml.example` to `node-12002-config.yml` and change values.

```yaml
address: :12002
external_address: http://localhost:12002
db: node12002.db
central_address: http://localhost:12001

s3:
  endpoint: http://127.0.0.1:9010
  region:
  key: minioadmin
  secret: minioadmin
  bucket: koto-node-12002

``` 

# Run

```
./node-service -config node-12002-config.yml
```

# API

```
### Post a message
POST http://localhost:12002/rpc.MessageService/Post
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "POST-MESSAGE-TOKEN",
  "text": "second message"
}


### Get all messages
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN
}


### Get messages from date/time (created_at >= date)
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN,
  "from": "2020-07-01"
}


### Get messages from date/time until date/time (created_at >= date1 and created_at < date2)
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN,
  "from": "2020-07-01",
  "until": "2020-08-01"
}


### Edit message
POST http://localhost:12002/rpc.MessageService/Edit
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4",
  "text": "updated message"
}

### Delete message
POST http://localhost:12002/rpc.MessageService/Delete
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4"
}


### Post comment
POST http://localhost:12012/rpc.MessageService/PostComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "GET-MESSAGES-TOKEN",
  "message_id": "55",
  "text": "new comment 123"
}


### Edit comment
POST http://localhost:12012/rpc.MessageService/EditComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "123",
  "text": "updated comment 123"
}


### Delete comment
POST http://localhost:12012/rpc.MessageService/DeleteComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "123"
}
```