import React from "react";
import { MessageItemProps } from "../../types/types";
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
    <MessageItemWrapper>
      <MessageContent flex-direction="row-reverse">
        <MessageContentBody>{messeageContent}</MessageContentBody>
        <MessageContentFooter></MessageContentFooter>
      </MessageContent>
    </MessageItemWrapper>
  );
};

export default MessageItem;
