
// status for the outgoing message
export enum OutGoingMessageStatus {
  PENDING_STATUS = 1,
  ACCEPTED_STATUS = 2,
  READ_STATUS = 3,
  NOT_SENT_STATUS = 4,
  UNKNOWN_STATUS = 5,
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