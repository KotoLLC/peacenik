
  // status for the outgoing message
  export enum MessagePublishStatus {
    // outgoing status
    PENDING_STATUS = "PENDING",
    ACCEPTED_STATUS = "ACCEPTED",
    READ_STATUS = "READ",
    NOT_SENT_STATUS = "NOT_SENT",
    UNKNOWN_STATUS = "UNKNOWN",
    // incomming status
    RECIEVED_STATUS = "RECIEVED",
    CATCHED_STATUS = "CATCHED",
  }

  export enum MessageType {
    PENDING_STATUS = "PENDING",
    ACCEPTED_STATUS = "ACCEPTED",
    READ_STATUS = "READ",
    NOT_SENT_STATUS = "NOT_SENT",
    UNKNOWN_STATUS = "UNKNOWN",
  }

  export enum MessageDirection {
    INCOMMING_MESSAGE = "incomming",
    OUTGOING_MESSAGE = "outgoing",
  }

  export enum MessageInfoTextStatus {
    HIGHLIGHT = "HIGHLIGHT",
    NORMAL = "NORMAL",
    UNKNOWN = "UNKNOWN",
  }

  export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    BUSY = "busy",
    UNKNOWN = "UNKNOWN",
  }
  export enum MessageContentType {
    VIDEO_TYPE = "VIDEO",
    IMAGE_TYPE = "IMAGE",
    TEXT_TYPE = "TEXT",
    FILE_TYPE = "FILE",
    VOICE_MAIL_TYPE = "VOICE_MAIL",
    UNKNOWN_TYPE = "UNKNOWN",
  }