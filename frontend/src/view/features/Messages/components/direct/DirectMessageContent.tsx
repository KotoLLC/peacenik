import React from "react";
import { CommonTypes, StoreTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'
import MessageItem from "../common/MessageItem";
import { useSelector, useDispatch } from 'react-redux'
import Actions from '@store/actions'

const DirectMessageContent = () => {
  const directMsgs: CommonTypes.MessageTypes.MessageItemProps[] = useSelector((state: StoreTypes) => state.messages.directMsgs)
  console.log("directMsgs: ", directMsgs)
  return (
    <div>
      {directMsgs.map((item) => (
        <MessageItem key={item.msgId} {...item}></MessageItem>
      ))}
    </div>
  );
};

export default DirectMessageContent;
