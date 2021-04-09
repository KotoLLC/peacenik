import React, { useEffect } from 'react'
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
import { ApiTypes, StoreTypes } from 'src/types'
import queryString from 'query-string'

interface Props extends RouteComponentProps {}

const MessagesPage: React.FC<Props> = (props) => {
  const baseUrl = useRouteMatch().path
  const dispatch = useDispatch()
  const { location } = props

  useEffect(() => {
    const parsed = queryString.parse(location.search)
    // console.log("SEARCH: ", parsed.id)

    dispatch(Actions.messages.getMessageTokensRequest())
    if ( parsed.id)
      dispatch(Actions.messages.addFriendToRoom(parsed.id as string))
  }, [dispatch])

  
  const directMsgRoomFriends = useSelector((state: StoreTypes) => state.messages.directMsgRoomFriends)

  console.log(directMsgRoomFriends)

  const usersWithMessages = useSelector(
    (state: StoreTypes) => state.messages.usersWithMessages
  )

  const messages = useSelector((state: StoreTypes) => state.messages)
  // console.log(messages)

  return (
    <>
      <FriendsPageTabs />
      <MessagesWrapper>
        {(directMsgRoomFriends.length > 0) ? <>
          <MesssageSidebar />
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
