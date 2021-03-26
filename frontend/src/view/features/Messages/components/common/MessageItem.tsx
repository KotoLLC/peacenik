import React from "react";
import { MessageDirection, MessageItemProps } from "../../types/types";
import {
  MessageContent,
  MessageContentBody,
  MessageContentFooter,
  MessageItemWrapper,
} from "../styles";

const MessageItem: React.FC<MessageItemProps> = ({
  direction,
  actionTime,
  status,
  contentType,
  messeageContent,
}: MessageItemProps) => {
  return (
    <MessageItemWrapper
      justify-content={
        direction == MessageDirection.INCOMMING_MESSAGE
          ? "flex-end"
          : "flex-start"
      }
    >
      <MessageContent>
        <MessageContentBody>{messeageContent}</MessageContentBody>
        <MessageContentFooter></MessageContentFooter>
      </MessageContent>
    </MessageItemWrapper>
  );
};

export default MessageItem;
