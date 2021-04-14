import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from 'react-router-dom'
import Actions from '@store/actions'
import { FriendsPageTabs } from '@view/features/Friends/components/FriendsPageTabs'
import { ContentWrapper, MessagesWrapper } from '../components/styles'
import MesssageSidebar from '../components/MesssageSidebar'
import DirectMessageBox from '../components/direct/DirectMessageBox'
import MesssageNoSelectBox from '../components/MessageNoSelectBox'
import DirectMessageInfoBox from '../components/direct/DirectMessageInfoBox'
import { CommonTypes, ApiTypes, StoreTypes } from 'src/types'
import queryString from 'query-string'

interface Props extends RouteComponentProps {}

const MessagesPage: React.FC<Props> = (props) => {
  const baseUrl = useRouteMatch().path
  const dispatch = useDispatch()
  const { location } = props
  const parsed = queryString.parse(location.search)
  const [friend_id, setFriendId] = useState("")
  const [msgToken, setMsgToken] = useState("")

  const directPostToken = useSelector(
    (state: StoreTypes) => state.messages.directPostToken
  )

  const feedsTokens = useSelector(
    (state: StoreTypes) => state.feed.feedsTokens
  )

  useEffect( () => {
    feedsTokens.map( (item) => {
      dispatch(Actions.messages.getFriendsList())
      
      if ( item.host === directPostToken.host)
        setMsgToken(item.token)
    })
  }, [feedsTokens, directPostToken])
  
  if ( location.pathname?.indexOf("messages/d/") > -1){
    let pathFriendId = location.pathname?.substring(location.pathname?.lastIndexOf('/') + 1)
    if ( (pathFriendId !== friend_id) && (pathFriendId !== ""))
      setFriendId(pathFriendId) 
  }
  
  useEffect( () => {
    if ( (friend_id !== "" ) && (feedsTokens.length > 0) && (msgToken !== "")){
      dispatch(Actions.messages.getFriendMsg({
        host: directPostToken.host,
        token: msgToken,
        friend: {
          id: friend_id
        }
      }))
    }
    if ( (friend_id !== "" ) && (feedsTokens.length === 0) && (msgToken !== "")){
      console.log("This is watching case.")
    }
  }, [friend_id, msgToken])

  useEffect(() => {
    if ( (parsed.id && parsed.fullname)){
      dispatch(Actions.messages.addFriendToRoom({
        id: parsed.id as string,
        fullName: parsed.fullname as string,
        accessTime: new Date()
      }))

      dispatch(Actions.messages.getDirectPostMsgToken(parsed.id as string))
    }
  }, [dispatch])

  useEffect( () => {
    if (friend_id !== "") {
      console.log("friend_id: ", friend_id)
      dispatch(Actions.messages.getDirectPostMsgToken(friend_id))
    }
  }, [friend_id])

  const directMsgRoomFriends: CommonTypes.MessageRoomFriendData[] = useSelector((state: StoreTypes) => state.messages.directMsgRoomFriends)

  const state = useSelector((state: StoreTypes) => state)
  console.log("state: ", state)

  return (
    <>
      <FriendsPageTabs />
      <MessagesWrapper>
        {(directMsgRoomFriends.length > 0) ? <>
          <MesssageSidebar location={location} />
          <ContentWrapper>
            <Switch>
              <Route
                path={`${baseUrl}/d/:id/info`}
                component={DirectMessageInfoBox}
              />
              <Route path={`${baseUrl}/d/:id`} component={DirectMessageBox} />
              <Route component={DirectMessageBox} />
            </Switch>
          </ContentWrapper>
        </> : <ContentWrapper><MesssageNoSelectBox /></ContentWrapper>}
      </MessagesWrapper>
    </>
  )
}

export default MessagesPage
