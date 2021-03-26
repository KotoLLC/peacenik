import React from "react";
import DirectMessageListItem from "./DirectMessageListItem";
import { MessageDirection, OutGoingMessageStatus } from "../../types/types";

const DirectMessageList = () => {
  return (
    <>
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        missedCount={2}
        msgType={MessageDirection.INCOMMING_MESSAGE}
      />
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        missedCount={0}
        msgType={MessageDirection.INCOMMING_MESSAGE}
      />
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        msgType={MessageDirection.OUTGOING_MESSAGE}
        messageStatus={OutGoingMessageStatus.READ_STATUS}
      />
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        msgType={MessageDirection.OUTGOING_MESSAGE}
        messageStatus={OutGoingMessageStatus.ACCEPTED_STATUS}
      />
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        msgType={MessageDirection.OUTGOING_MESSAGE}
        messageStatus={OutGoingMessageStatus.PENDING_STATUS}
      />
      <DirectMessageListItem
        roomId="123"
        userId="123"
        fullName="Austin Larson"
        accessTime="123"
        lastMsg="The rules of travel have altered so much in the last few years, with strict reulation regarding."
        msgType={MessageDirection.OUTGOING_MESSAGE}
        messageStatus={OutGoingMessageStatus.NOT_SENT_STATUS}
      />
    </>
  );
};

export default DirectMessageList;
