# Message Hub API reference

### Post a message

```
POST http://localhost:12002/rpc.MessageService/Post
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "POST-MESSAGE-TOKEN",
  "text": "second message",
  "attachment_id": "ATTACHMENT-BLOB-ID"
}
```

### Get all messages

```
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN,
  "count": COUNT
}
```

### Get messages from date/time (created_at > date)

```
POST http://localhost:12002/rpc.MessageService/Messages
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN,
  "from": "2020-08-09T06:36:09.308Z",
  "count": COUNT
}
```

### Get message by ID

```
POST http://localhost:12002/rpc.MessageService/Message
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  GET-MESSAGES-TOKEN,
  "message_id": "MESSAGE_ID"
}
```

### Edit message

```
POST http://localhost:12002/rpc.MessageService/Edit
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4",
  "text_changed": true,
  "text": "updated message"
  "attachment_changed": true,
  "attachment_id": "ATTACHMENT-BLOB-ID"
}
```

### Delete message

```
POST http://localhost:12002/rpc.MessageService/Delete
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "4"
}
```

### Post comment

```
POST http://localhost:12012/rpc.MessageService/PostComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "token":  "GET-MESSAGES-TOKEN",
  "message_id": "55",
  "text": "new comment 123",
  "attachment_id": "ATTACHMENT-BLOB-ID"
}
```

### Edit comment

```
POST http://localhost:12012/rpc.MessageService/EditComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "123",
  "text_changed": true,
  "text": "updated comment 123"
  "attachment_changed": true,
  "attachment_id": "ATTACHMENT-BLOB-ID"
}
```

### Delete comment

```
POST http://localhost:12012/rpc.MessageService/DeleteComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "123"
}
```

### Set message visibility

```
POST http://localhost:12012/rpc.MessageService/SetMessageVisibility
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "MESSAGE-ID",
  "visibility": false
}
```

### Set comment visibility

```
POST http://localhost:12012/rpc.MessageService/SetCommentVisibility
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "COMMENT-ID",
  "visibility": false
}
```

## Likes

### Like a message

```
POST http://localhost:12012/rpc.MessageService/LikeMessage
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "MESSAGE-ID"
}
```

### Unlike a message

```
POST http://localhost:12012/rpc.MessageService/LikeMessage
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "MESSAGE-ID",
  "unlike": true
}
```

### Like a comment

```
POST http://localhost:12012/rpc.MessageService/LikeComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "COMMENT-ID"
}
```

### Unlike a comment

```
POST http://localhost:12012/rpc.MessageService/LikeComment
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "COMMENT-ID",
  "unlike": true
}
```

### Message likes

```
POST http://localhost:12012/rpc.MessageService/MessageLikes
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "MESSAGE-ID"
}
```

### Comment likes

```
POST http://localhost:12012/rpc.MessageService/CommentLikes
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "comment_id": "COMMENT-ID"
}

```

## Blobs


### Get blob upload link

```
POST http://localhost:12012/rpc.BlobService/UploadLink
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "content_type": "image/png",
  "file_name": "image.png",
}
```

## Notifications

### Notification counters (total, unread)

```
POST http://localhost:12012/rpc.NotificationService/Count
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{}
```

### Notifications

```
POST http://localhost:12012/rpc.NotificationService/Notifications
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{}
```

### Mark notifications as read

```
POST http://localhost:12012/rpc.NotificationService/MarkRead
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "last_known_id": "LAST-KNOWN-NOTIFICATION-ID"
}
```

### Clean notifications

```
POST http://localhost:12012/rpc.NotificationService/Clean
Authorization: Bearer AUTH-TOKEN
Content-Type: application/json

{
  "last_known_id": "LAST-KNOWN-NOTIFICATION-ID"
}
```

## Report a message

```
POST http://localhost:12012/rpc.MessageService/ReportMessage
Authorization: BEARER AUTH-TOKEN
Content-Type: application/json

{
  "message_id": "ed61fc76-1172-4579-8a5f-ec4532094993",
  "report": "bad message"
}
```

Returns:
```
{
  "report_id": "REPORT-ID"
}
```

## Get all message reports (node admin access)

```
POST http://localhost:12012/rpc.MessageService/MessageReports
Authorization: BEARER AUTH-TOKEN
Content-Type: application/json

{}
```

## Delete a reported message (node admin access)

```
POST http://localhost:12002/rpc.MessageService/DeleteReportedMessage
Authorization: BEARER AUTH-TOKEN
Content-Type: application/json

{
  "report_id": "REPORT-ID"
}
```

## Block an author of a reported message (node admin access)

```
POST http://localhost:12002/rpc.MessageService/BlockReportedUser
Authorization: BEARER AUTH-TOKEN
Content-Type: application/json

{
  "report_id": "REPORT-ID"
}
```

## Mark a message report as resolved (node admin access)

```
POST http://localhost:12002/rpc.MessageService/ResolveMessageReport
Authorization: BEARER AUTH-TOKEN
Content-Type: application/json

{
  "report_id": "REPORT-ID"
}
```
