import { Url } from "url";

// status for the outgoing message
export enum MessagePublishStatus {
  PENDING_STATUS = "PENDING",
  ACCEPTED_STATUS = "ACCEPTED",
  READ_STATUS = "READ",
  NOT_SENT_STATUS = "NOT_SENT",
  RECIEVED_STATUS = "RECIEVED",
  CATCHED_STATUS = "CATCHED",
  UNKNOWN_STATUS = "UNKNOWN",

}

export enum MessageType {
  PENDING_STATUS = "PENDING",
  ACCEPTED_STATUS = "ACCEPTED",
  READ_STATUS = "READ",
  NOT_SENT_STATUS = "NOT_SENT",
  UNKNOWN_STATUS = "UNKNOWN",
}

export enum MessageDirection {
  INCOMMING_MESSAGE = 1,
  OUTGOING_MESSAGE = 2,
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

export interface MessageItemProps {
  msgId: string;
  direction: MessageDirection;
  actionTime: Date;
  status: MessagePublishStatus;
  contentType: MessageContentType;
  messeageContent: string | Url;
}

