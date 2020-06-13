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
POST http://localhost:12002/messages/post
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "POST-TOKEN",
  "message": {
    "id": "2",
    "user_id": "d18871d9-233e-4dbe-bf30-ad3a1689f985",
    "user_name": "andrey",
    "text": "second message",
    "created_at": "2020-06-12T10:16:40.335Z",
    "updated_at": "2020-06-12T10:16:40.335Z"
  }
}
```