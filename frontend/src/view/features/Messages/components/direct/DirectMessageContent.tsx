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
  // const dispatch = useDispatch()
  // const isMessagesRequested = useSelector(
  //   (state: StoreTypes) => state.messages.isMessagesRequested
  // )
  const directMsgs: CommonTypes.MessageTypes.MessageItemProps[] = useSelector((state: StoreTypes) => state.messages.directMsgs)

  useEffect( () => {
    // if ( (directMsgs.length < 11 ) && isMessagesRequested && dispatch) {
      // console.log("scroll down", directMsgs, isMessagesRequested)
      firstMsgRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    // }
  }, [firstMsgRef, directMsgs])
  // console.log("firstMsgRef: ", firstMsgRef)

  return (
    <MsgWrapper>
      {directMsgs.map((item, idx) => (
        (idx !== 0) ? <MessageItem key={idx} {...item}></MessageItem> : <div ref={firstMsgRef} key={idx}><MessageItem {...item}></MessageItem></div>
      ))}
    </MsgWrapper>
  )
}

export default DirectMessageContent
