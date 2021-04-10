import { all, call, put, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes, CommonTypes } from 'src/types'
import { setUserNames } from '@services/userNames'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import selectors from '@selectors/index'
import { Types as DirectMessagesTypes } from '@store/messages/actions'
import { Types as FeedMessagesTypes } from '@store/feed/actions'
import { watchGetMessagesFromHub } from './feed'

export function * watchGetFriendMsgAPIData(action: {
  type: string,
  payload: ApiTypes.Messages.GetFriendMsgAPIData
}) {
  try {
    console.log("watchGetFriendMsgAPIData: ", action)
    const response = yield API.messages.getFriendMessage(action.payload)
    console.log("watchGetFriendMsgAPIData RESPONSE: ", response.data.messages)
    if (response.status === 200) {
      // response.data.messages
      // yield put(Actions.messages.getFriendMsgSuccess())

    } else if (response.status === 400) {
      console.log("watchGetFriendMsgAPIData ERROR:", response)
    }
  } catch (error) {
    yield put(Actions.common.getMsgToken())
  }
}

export function * watchSendMsgToFriend(action: {
  type: string, 
  payload: ApiTypes.Feed.PostMessage
}) {
  try {
    console.log("watchSendMsgToFriend: ", action)
    const response = yield API.feed.postMessage(action.payload)
    console.log("watchSendMsgToFriend RESPONSE: ", response)
    if (response.status === 200) {
      console.log("POST SUCCESS")

    } else if (response.status === 400) {
      console.log("watchSendMsgToFriend ERROR:", response)
    }
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}

export function * watchGetDirectPostMsgToken(action: { type: string, payload: string }){
  try {
    const response = yield API.messages.getDirectPostMessageToken(action.payload)
    if (response.status === 200) {
      let tokens:CommonTypes.TokenData[] = Object.entries(response.data.tokens).map( ([key, value]) => ({
        host: key,
        token: value as string
      }))
      if ( tokens.length > 0)
        yield put(Actions.messages.setDirectMsgPostToken(tokens[0]))

    } else if (response.status === 400) {
      console.log("getDirectPostMessageToken ERROR:", response)
    }
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}

export function * watchGetDirectMessages() {
  try {

    const response = yield API.feed.getMessages()

    if (response.status === 200) {
      const feedsTokens = hubsForMessagesBack2Front(response.data?.tokens)
      yield put(Actions.feed.getFeedTokensSuccess(feedsTokens))
  
      const peacenikfeedsTokens = {
        tokens: feedsTokens
      }
      localStorage.setItem('peacenikfeedsTokens', JSON.stringify(peacenikfeedsTokens))
  
      const friendsRes = yield API.friends.getFriends()
      if(friendsRes.status === 200) {
        // console.log(friendsRes.data.friends);
        const friends = friendsRes.data.friends.map(item=>({
          id:item.user.id,
          username: item.user.name,
          full_name: item.user.full_name,
        }))
        // console.log('friends', friends);
  
        if (!feedsTokens.length) {
          yield put(Actions.feed.getFeedFromHubFailed())
        }
    
        if (feedsTokens.length) {
          yield all(feedsTokens.map(item => {             
              return call(watchGetUserLastMessagesFromHub, {
                type: DirectMessagesTypes.GET_MESSAGE_TOKENS_FROM_HUB_REQUEST,
                payload: {
                  host: item.host,
                  friends:friends,
                  token: item.token,                  
                },
              })
            }))
        }   
       
      } else if(friendsRes.status === 401) {
        localStorage.clear()
        window.location.reload()
      }
    } else if (response.error.response.status === 401) {
      localStorage.clear()
      window.location.reload()
    }
  

  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }

}

export function* watchGetUserLastMessagesFromHub(action: { type: string, payload: ApiTypes.Messages.UserMessagesFromHub }) {
  try {
    const resultData = yield API.messages.getUserLastMessagesFromHub(action.payload)
    // sort the last date
    resultData.sort((a,b)=>a.created_at > b.created_at? -1: 1)
    // console.log(resultData)
    // export interface UserMessage {
    //   user_id: string
    //   messages: Feed.Message[]
    //   lastMessageDate?: string | null
    //   username?: string
    //   full_name?: string
    // }  
    yield put(Actions.messages.getUserLastMessageFromHubSuccess({
      hub: action.payload.host,
      usersLastMessage: resultData
    }))
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}