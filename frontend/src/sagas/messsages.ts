import { all, call, put, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { 
  ApiTypes, 
  CommonTypes
} from 'src/types'
import * as EnumTypes from '../types/enum'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import selectors from '@selectors/index'
import { Types as DirectMessagesTypes } from '@store/messages/actions'
import { getUserNameByUserId } from '@services/userNames';

export function * watchDeleteDirectMsg(action: {
  type: string,
  payload: ApiTypes.Messages.DeleteMessage
}) {
  try {
    const response = yield API.feed.deleteMessage(action.payload)
    if (response.status === 200) {
      const state = yield select()
      const feedsTokens = selectors.feed.feedsTokens(state)
      let msgToken = ""
      feedsTokens.map( (item) => {
        if ( item.host === action.payload.host)
          msgToken = item.token

        return item
      })
      yield call(watchGetFriendMsgAPIData, {
        type: "test",
        payload: {
          host: action.payload.host,
          token: msgToken,
          friend: {
            id: action.payload.body.friend_id
          }
        }
      })
    } 
  } catch (error) {
    console.log("watchDeleteDirectMsg Error: ", error)
  }
}

export function * watchGetFriendMsgAPIData(action: {
  type: string,
  payload: ApiTypes.Messages.GetFriendMsgAPIData
}) {
  try {
    const response = yield API.messages.getFriendMessage(action.payload)
    if (response.status === 200) {
      const state = yield select()
      const currentUserId = selectors.profile.userId(state)
      const resMessages: CommonTypes.MessageTypes.MessageItemProps[] = response.data.messages.map( (item, idx) => ({
        msgId: item.id,
        direction: (item.user_id === currentUserId) ? EnumTypes.MessageDirection.OUTGOING_MESSAGE : EnumTypes.MessageDirection.INCOMMING_MESSAGE,
        actionTime: item.created_at,
        status: (item.is_read) ? EnumTypes.MessagePublishStatus.ACCEPTED_STATUS : EnumTypes.MessagePublishStatus.PENDING_STATUS,
        contentType: (item.attachment === "") ? EnumTypes.MessageContentType.TEXT_TYPE : EnumTypes.MessageContentType.IMAGE_TYPE,
        messeageContent: (item.attachment === "") ? item.text as string : item.attachment
      }))

      yield put(Actions.messages.getFriendMsgSuccess(resMessages, action.payload))

    } else if (response.status === 400) {
      console.log("watchGetFriendMsgAPIData ERROR:", response)
    }
  } catch (error) {
    yield put(Actions.common.getMsgToken())
  }
}

export function * watchDirectMsgUploadLink(action: {type: string, payload: ApiTypes.UploadLinkRequestWithHost}) {
  try {
    const response = yield API.messages.getUploadLink(action.payload)

    if (response.status === 200) {
      yield put(Actions.messages.getDirectMsgUploadLinkSucces(response.data))
    } else {
      yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
    }
  } catch (error) {
    console.log("watchDirectMsgUploadLink error: ", error)
  }
}

export function * watchGetFriendsList(action: { type: string }) {
  try {
    const state = yield select()
    const feedsTokens = selectors.feed.feedsTokens(state)

    if (feedsTokens.length) {
      yield all(feedsTokens.map(item => {             
        return call(watchGetFriendsFromHub, {
          type: DirectMessagesTypes.GET_FRIENDS_FROM_HUB,
          payload: {
            host: item.host,
            token: item.token                 
          },
        })
      }))
    }   

  } catch (error) {
    console.log("watchGetFriendsList error: ", error)
  }
}

export function * watchGetFriendsFromHub( action: {
  type: string,
  payload: ApiTypes.HubToken
}) {
  try {
    const response = yield API.messages.getFriendFromHub(action.payload)
    if ( response.status === 200) {
      const friendsList:CommonTypes.MessageRoomFriendData[] = Object.entries<CommonTypes.FriendCounterData>(response.data.direct_counters).map( ([key, value]) => ({
        id: key,
        fullName: getUserNameByUserId(key),
        accessTime: value.last_message_time
      }))
      yield put(Actions.messages.addFriendsToRoom(friendsList))
    }
  } catch (error) {
    console.log("watchGetFriendsFromHub: ", error)
  }
}

export function * watchSendMsgToFriend(action: {
  type: string, 
  payload: ApiTypes.Feed.PostMessage
}) {
  try {
    const response = yield API.feed.postMessage(action.payload)
    if (response.status === 200) {
      yield put(Actions.messages.setPostMsgToFriendSuccess(true))
      yield put(Actions.messages.getFriendMsg({
          host: action.payload.host,
          token: action.payload.body.msg_token ? action.payload.body.msg_token: "",
          friend: {
            id: action.payload.body.friend_id ? action.payload.body.friend_id: ""
          },
          count:1
        }))
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