import { IconWrapper } from '@view/shared/styles';
import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {
  MessageContentType,
  MessageDirection,
  MessageItemProps,
  MessagePublishStatus,
} from '../../types/types';
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

const MessageItem: React.FC<MessageItemProps> = ({
  direction,
  actionTime,
  status,
  contentType,
  messeageContent,
}: MessageItemProps) => {
  return (
    <MessageItemWrapper justify-content={direction}>
      {/* message  */}
      {contentType === MessageContentType.TEXT_TYPE && (
        <MessageTextContent color={direction}>
          <MessageTextContentBody>{messeageContent}</MessageTextContentBody>
          <MessageTextContentFooter>
            <MessageTransmissionTime color={direction}>
              10:09 pm
            </MessageTransmissionTime>
          </MessageTextContentFooter>
        </MessageTextContent>
      )}
      {contentType === MessageContentType.IMAGE_TYPE && (
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
