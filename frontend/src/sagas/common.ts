import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'

export function* watchGetMsgToken() {
  try {
    const response = yield API.feed.getMessages()
    if (response.status === 200) {
      const feedsTokens = hubsForMessagesBack2Front(response.data?.tokens)
      yield put(Actions.feed.getFeedTokensSuccess(feedsTokens))
  
      const peacenikfeedsTokens = {
        tokens: feedsTokens
      }
      localStorage.setItem('peacenikfeedsTokens', JSON.stringify(peacenikfeedsTokens))
    }
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}
