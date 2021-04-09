import React, { useCallback, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import {
  ContactAvatarStyled,
  MessageCard,
  MessageCardContent,
  MessageInfoBlock,
  MessageInfoContent,
  MessageInfoDisplayName,
  MessageInfoHeader,
  MessageInfoLastAccessTime,
  MessageInfoText,
  MessageMissedCount,
  StatusIconWrapper,
  StatusWrapper,
} from '@view/features/Messages/components/styles';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {
  MessageDirection,
  MessageInfoTextStatus,
  MessagePublishStatus,
} from '@view/features/Messages/types/types';
import { dateToRelateString } from '@services/dateToRelateString';

interface Props {
  userId: string;
  accessTime: string;
  fullName: string;
}

const DirectMessageListItem: React.FC<Props> = ({
  fullName,
  userId,
  accessTime,
}) => {
  const baseURL = useRouteMatch().path;

  const getAvatarUrl = (id) => {
    return id;
  };
  const getLastMessageTime = () => {
    return dateToRelateString(accessTime);
  };

  const renderOutgoingSwitch = useCallback(
    (status: MessagePublishStatus | undefined) => {
      switch (status) {
        case MessagePublishStatus.PENDING_STATUS:
          return <DonutLargeIcon />;
        case MessagePublishStatus.ACCEPTED_STATUS:
          return <DoneIcon />;
        case MessagePublishStatus.READ_STATUS:
          return <DoneAllIcon style={{ color: '#599C0B' }} />;
        case MessagePublishStatus.NOT_SENT_STATUS:
        case MessagePublishStatus.UNKNOWN_STATUS:
      }
      return <InfoOutlinedIcon />;
    },
    []
  );

  return (
    <MessageCard>
      <MessageCardContent>
        <Link to={`/profile/user?id=${userId}`}>
          <ContactAvatarStyled alt={fullName} src={getAvatarUrl(userId)} />
        </Link>
        <MessageInfoBlock to={`${baseURL}/${userId}`}>
          <MessageInfoHeader>
            <MessageInfoDisplayName>{fullName}</MessageInfoDisplayName>
            <MessageInfoLastAccessTime>
              {getLastMessageTime()}
            </MessageInfoLastAccessTime>
          </MessageInfoHeader>
        </MessageInfoBlock>
      </MessageCardContent>
    </MessageCard>
  );
};

export default DirectMessageListItem;
