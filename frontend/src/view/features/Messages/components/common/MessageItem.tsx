import { IconWrapper } from '@view/shared/styles';
import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { CommonTypes, Enum } from 'src/types'
import {
  MessageTextContent,
  MessageTextContentBody,
  MessageTextContentFooter,
  MessageDeliverStatus,
  MessageItemWrapper,
  MessageStatusIconWrapper,
  MessageTransmissionTime,
  StatusIconWrapper,
  MessageImageContent,
  MessageImageContentBody,
  MessageImageContentFooter,
} from '../styles';

const MessageItem: React.FC<CommonTypes.MessageTypes.MessageItemProps> = ({
  direction,
  actionTime,
  status,
  contentType,
  messeageContent,
}: CommonTypes.MessageTypes.MessageItemProps) => {
  return (
    <MessageItemWrapper justify-content={direction}>
      {/* message  */}
      {contentType === Enum.MessageContentType.TEXT_TYPE && (
        <MessageTextContent color={direction}>
          <MessageTextContentBody>{messeageContent}</MessageTextContentBody>
          <MessageTextContentFooter>
            <MessageTransmissionTime color={direction}>
              10:09 pm
            </MessageTransmissionTime>
          </MessageTextContentFooter>
        </MessageTextContent>
      )}
      {contentType === Enum.MessageContentType.IMAGE_TYPE && (
        <MessageImageContent color={direction}>
          <MessageImageContentBody
            src={messeageContent.toString()}
            alt='IMAGE'
          />
          <MessageImageContentFooter color={direction}>
            <MessageTransmissionTime color={direction}>
              10:09 pm
            </MessageTransmissionTime>
          </MessageImageContentFooter>
        </MessageImageContent>
      )}
    </MessageItemWrapper>
  );
};

export default MessageItem;
