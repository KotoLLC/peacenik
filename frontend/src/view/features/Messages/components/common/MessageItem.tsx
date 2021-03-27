import { IconWrapper } from "@view/shared/styles";
import React from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import {
  MessageDirection,
  MessageItemProps,
  MessagePublishStatus,
} from "../../types/types";
import {
  MessageContent,
  MessageContentBody,
  MessageContentFooter,
  MessageDeliverStatus,
  MessageItemWrapper,
  MessageTransmissionTime,
} from "../styles";

const MessageItem: React.FC<MessageItemProps> = ({
  direction,
  actionTime,
  status,
  contentType,
  messeageContent,
}: MessageItemProps) => {
  return (
    <MessageItemWrapper justify-content={direction}>
      <MessageContent color={direction}>
        <MessageContentBody>{messeageContent}</MessageContentBody>
        <MessageContentFooter>
          <MessageTransmissionTime>10:09 pm</MessageTransmissionTime>
          <MessageDeliverStatus>
            {status === MessagePublishStatus.ACCEPTED_STATUS && (
              <IconWrapper>
                <DoneAllIcon />
              </IconWrapper>
            )}
          </MessageDeliverStatus>
        </MessageContentFooter>
      </MessageContent>
    </MessageItemWrapper>
  );
};

export default MessageItem;
