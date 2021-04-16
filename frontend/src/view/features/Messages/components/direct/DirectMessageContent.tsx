import React, { useEffect } from "react"

import { CommonTypes, StoreTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'
import MessageItem from "../common/MessageItem"
import { useSelector, useDispatch } from 'react-redux'
import Actions from '@store/actions'
import {
  MsgWrapper
} from '../styles'

const DirectMessageContent = () => {
  const firstMsgRef = React.createRef<HTMLDivElement>()

  useEffect( () => {
    firstMsgRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [firstMsgRef])
  console.log("firstMsgRef: ", firstMsgRef)

  const directMsgs: CommonTypes.MessageTypes.MessageItemProps[] = useSelector((state: StoreTypes) => state.messages.directMsgs)
  return (
    <MsgWrapper>
      {directMsgs.map((item, idx) => (
        (idx !== 0) ? <MessageItem key={item.msgId} {...item}></MessageItem> : <div ref={firstMsgRef} key={item.msgId}><MessageItem {...item}></MessageItem></div>
      ))}
    </MsgWrapper>
  )
}

export default DirectMessageContent
