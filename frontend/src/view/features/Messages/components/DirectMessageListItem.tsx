import React, { useCallback, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import {
  ContactAvatarStyled,
  MessageCard,
  MessageInfo,
  MessageInfoBlock,
  MessageInfoContent,
  MessageInfoDisplayName,
  MessageInfoHeader,
  MessageInfoLastAccessTime,
  MessageInfoText,
  MessageMissedCount,
  StatusIconWrapper,
  StatusWrapper,
} from "./styles";

import { ReactComponent as DoubleTickIcon } from "@assets/images/double-tick-indicator.svg";
import { ReactComponent as TickIcon } from "@assets/images/tick-indicator.svg";
import { ReactComponent as CircleInfoIcon } from "@assets/images/circle_info.svg";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { IconWrapper, Text, TextUnderlined } from "@view/shared/styles";
import { MessageDirection, OutGoingMessageStatus } from "../types/types";

interface Props {
  roomId: string;
  userId: string;
  accessTime: string;
  fullName: string;
  lastMsg: string;
  msgType: MessageDirection;
  missedCount?: number;
  messageStatus?: OutGoingMessageStatus;
}

const DirectMessageListItem: React.FC<Props> = ({
  fullName,
  userId,
  roomId,
  lastMsg,
  msgType,
  missedCount,
  messageStatus,
}) => {
  const baseURL = useRouteMatch().path;

  const [lastAcsTime, setLastAscTime] = useState<string>("12 mins ago");
  const getAvatarUrl = (id) => {
    return id;
  };
  const getLastMessageTime = () => {
    return "12 min ago";
  };

  const accessTime = getLastMessageTime();

  const renderOutgoingSwitch = useCallback(
    (status: OutGoingMessageStatus | undefined) => {
      switch (status) {
        case OutGoingMessageStatus.PENDING_STATUS:
          return <DonutLargeIcon />;
        case OutGoingMessageStatus.ACCEPTED_STATUS:
          return <TickIcon />;
        case OutGoingMessageStatus.READ_STATUS:
          return <DoubleTickIcon />;
        case OutGoingMessageStatus.NOT_SENT_STATUS:
        case OutGoingMessageStatus.UNKNOWN_STATUS:
      }
      return <CircleInfoIcon />;
    },
    []
  );

  return (
    <MessageCard>
      <Link to={`/profile/user?id=${userId}`}>
        <ContactAvatarStyled alt={fullName} src={getAvatarUrl(userId)} />
      </Link>
      <MessageInfoBlock to={`${baseURL}/${userId}`}>
        <MessageInfoHeader>
          <MessageInfoDisplayName>{fullName}</MessageInfoDisplayName>
          <MessageInfoLastAccessTime>{accessTime}</MessageInfoLastAccessTime>
        </MessageInfoHeader>
        <MessageInfoContent
          flex-direction={
            msgType === MessageDirection.INCOMMING_MESSAGE ? "row" : "reverse"
          }
        >
          <MessageInfoText
            color={
              msgType === MessageDirection.INCOMMING_MESSAGE &&
              missedCount &&
              missedCount > 0
                ? "hot"
                : "normal"
            }
          >
            {lastMsg}
          </MessageInfoText>
          {msgType === MessageDirection.INCOMMING_MESSAGE &&
            (missedCount && missedCount > 0 ? (
              <MessageMissedCount>
                <span>{missedCount}</span>
              </MessageMissedCount>
            ) : (
              <></>
            ))}
          {msgType === MessageDirection.OUTGOING_MESSAGE && (
            <StatusWrapper>
              <StatusIconWrapper>
                {renderOutgoingSwitch(messageStatus)}
              </StatusIconWrapper>
            </StatusWrapper>
          )}
        </MessageInfoContent>
      </MessageInfoBlock>
    </MessageCard>
  );
};

export default DirectMessageListItem;
