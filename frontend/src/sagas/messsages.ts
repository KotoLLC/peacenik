import { all, call, put, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { setUserNames } from '@services/userNames'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import selectors from '@selectors/index'
import { Types as DirectMessagesTypes } from '@store/messages/actions'
import { Types as FeedMessagesTypes } from '@store/feed/actions'
import { watchGetMessagesFromHub } from './feed'

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
        const friends = friendsRes.data.friends.map(item=>item.user.id)
        console.log('friends', friends);
  
        if (!feedsTokens.length) {
          yield put(Actions.feed.getFeedFromHubFailed())
        }
    
        if (feedsTokens.length) {
          yield all(feedsTokens.map(item => { 
            return all(friends.map((friend)=>{              
              return call(watchGetMessagesFromHub, {
                type: DirectMessagesTypes.GET_MESSAGE_TOKENS_FROM_HUB_REQUEST,
                payload: {
                  host: item.host,
                  body: {
                    token: item.token,
                    friend_id,
                    count: 1
                  },
                },
              })
            }))
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

