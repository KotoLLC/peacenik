import { all, call, put, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { 
  ApiTypes, 
  CommonTypes
} from 'src/types'
import * as EnumTypes from '../types/enum'
import { setUserNames } from '@services/userNames'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import selectors from '@selectors/index'
import { Types as DirectMessagesTypes } from '@store/messages/actions'
import { Types as FeedMessagesTypes } from '@store/feed/actions'
import { watchGetMessagesFromHub } from './feed'
import { getUserNameByUserId } from '@services/userNames';

//   {
//     msgId: "1293903-4123412341-12341234134-12341234",
//     direction: EnumTypes.MessageDirection.OUTGOING_MESSAGE,
//     actionTime: new Date("2021-3-26"),
//     status: EnumTypes.MessagePublishStatus.ACCEPTED_STATUS,
//     contentType: EnumTypes.MessageContentType.TEXT_TYPE,
//     messeageContent: "I'm looking for a truly",
//   },
//   "id": "5e183be8-be6e-44b9-9562-85eb87a282aa",
//   "user_id": "2c415538-e86f-4553-a3d1-49ff2d4ab3ff",
//   "text": "Test",
//   "attachment": "",
//   "attachment_type": "",
//   "attachment_thumbnail": "",
//   "created_at": "2021-04-09T08:36:21.433-06:00",
//   "updated_at": "2021-04-09T08:36:21.433-06:00",
//   "likes": 0,
//   "liked_by_me": false,
//   "comments": [],
//   "liked_by": [],
//   "is_read": false

export function * watchGetFriendMsgAPIData(action: {
  type: string,
  payload: ApiTypes.Messages.GetFriendMsgAPIData
}) {
  try {
    const response = yield API.messages.getFriendMessage(action.payload)
    console.log("watchGetFriendMsgAPIData RESPONSE: ", response.data.messages)
    if (response.status === 200) {
      const state = yield select()
      const currentUserId = selectors.profile.userId(state)
      const resMessages: CommonTypes.MessageTypes.MessageItemProps[] = response.data.messages.map( (item, idx) => ({
        msgId: item.id,
        direction: (item.user_id === currentUserId) ? EnumTypes.MessageDirection.OUTGOING_MESSAGE : EnumTypes.MessageDirection.INCOMMING_MESSAGE,
        actionTime: item.created_at,
        status: (item.is_read) ? EnumTypes.MessagePublishStatus.ACCEPTED_STATUS : EnumTypes.MessagePublishStatus.PENDING_STATUS,
        contentType: EnumTypes.MessageContentType.TEXT_TYPE,
        messeageContent: item.text as string
      }))

      yield put(Actions.messages.getFriendMsgSuccess(resMessages))

    } else if (response.status === 400) {
      console.log("watchGetFriendMsgAPIData ERROR:", response)
    }
  } catch (error) {
    yield put(Actions.common.getMsgToken())
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
    console.log("watchGetFriendsList: ", error)
  }
}

export function * watchGetFriendsFromHub( action: {
  type: string,
  payload: ApiTypes.HubToken
}) {
  try {
    const response = yield API.messages.getFriendFromHub(action.payload)
    if ( response.status === 200) {
      // const friendsList = response.data.direct_counters
      

      const friendsList:CommonTypes.MessageRoomFriendData[] = Object.entries<CommonTypes.FriendCounterData>(response.data.direct_counters).map( ([key, value]) => ({
        id: key,
        fullName: getUserNameByUserId(key),
        accessTime: value.last_message_time
      }))
      yield put(Actions.messages.addFriendsToRoom(friendsList))
    }
    console.log("getFriendFromHub: ", response.data.direct_counters)
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