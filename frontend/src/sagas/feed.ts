import { put, all, call, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { CommonTypes, ApiTypes } from 'src/types'
import { currentHubBack2Front } from '@services/dataTransforms/currentHubTransform'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import { Types as MessagesTypes } from '@store/feed/actions'
import selectors from '@selectors/index'

export function* watchGetMessages() {
  try {

    const response = yield API.feed.getMessages()

    if (response.status === 200) {
      const feedsTokens = hubsForMessagesBack2Front(response.data?.tokens)
      yield put(Actions.feed.getFeedTokensSuccess(feedsTokens))
  
      const peacenikfeedsTokens = {
        tokens: feedsTokens
      }
      localStorage.setItem('peacenikfeedsTokens', JSON.stringify(peacenikfeedsTokens))
  
      const state = yield select()
      const hubsWithMessages = selectors.feed.hubsWithMessages(state)
  
      if (!feedsTokens.length) {
        yield put(Actions.feed.getFeedFromHubFailed())
      }
  
      if (feedsTokens.length) {
        yield all(feedsTokens.map(item => {
  
          let count
  
          if (hubsWithMessages.get(item.host)) {
            const currentHub = hubsWithMessages.get(item.host)
            if (currentHub?.messages?.length) {
              count = currentHub.messages.length
            }
          }
  
          return call(watchGetMessagesFromHub, {
            type: MessagesTypes.GET_FEED_TOKENS_FROM_HUB_REQUEST,
            payload: {
              host: item.host,
              body: {
                token: item.token,
                count,
              }
            },
          })
        }
        ))
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

export function* watchGetMoreMessages() {
  const response = yield API.feed.getMessages()

  if (response.status === 200) {
    const feedsTokens = hubsForMessagesBack2Front(response.data?.tokens)
    yield put(Actions.feed.getMoreFeedSucces(feedsTokens))

    yield all(feedsTokens.map(item => call(watchGetMoreMessagesFromHub, {
      type: MessagesTypes.GET_MORE_FEED_FROM_HUB_REQUEST,
      payload: {
        host: item.host,
        body: {
          token: item.token,
        }
      },
    })))
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.feed.getMoreFeedFailed())
  }
}

export function* watchGetCurrentHub() {
  const response = yield API.feed.getCurrentHub()

  if (response.status === 200) {
    yield put(Actions.feed.getCurrentHubSuccess(currentHubBack2Front(response.data?.tokens)))
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.feed.getCurrentHubFailed())
  }
}

export function* watchGetMoreMessagesFromHub(action: { type: string, payload: ApiTypes.Feed.MessagesFromHub }) {
  const state = yield select()
  const hubsWithMessages = selectors.feed.hubsWithMessages(state)

  if (hubsWithMessages.get(action.payload.host)) {
    const currentHub = hubsWithMessages.get(action.payload.host)
    action.payload.body.from = currentHub?.lastMessageDate || ''
    action.payload.body.count = '10'
  }

  const response = yield API.feed.getMessagesFromHub(action.payload)

  if (response.status === 200) {
    let resultData = []
    if (response.data?.messages?.length) {
      resultData = response.data?.messages.map(item => {
        item.sourceHost = action.payload.host
        item.messageToken = action.payload.body.token
        return item
      })
    }
    yield put(Actions.feed.getFeedFromHubSuccess({
      hub: action.payload.host,
      messages: resultData
    }))
  } else {
    yield put(Actions.feed.getMoreFeedFromHubFailed())
    if (response.error.response.status === 400) {
      yield put(Actions.authorization.getAuthTokenRequest())
      // yield put(Actions.feed.getFeedTokensRequest())
    }
  }
}

export function* watchGetMessagesFromHub(action: { type: string, payload: ApiTypes.Feed.MessagesFromHub }) {
  
  try {
    const response = yield API.feed.getMessagesFromHub(action.payload)

    if (response.status === 200) {
      let resultData = []
      if (response.data?.messages?.length) {
        resultData = response.data?.messages.map(item => {
          item.sourceHost = action.payload.host
          item.messageToken = action.payload.body.token
          return item
        })
      }
  
      yield put(Actions.feed.getFeedFromHubSuccess({
        hub: action.payload.host,
        messages: resultData
      }))
    } else {
      if (response.error.response.status === 400) {
        // yield put(Actions.authorization.getAuthTokenRequest())
        // yield put(Actions.feed.getFeedTokensRequest())
      }
    }
    
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }

}

export function* watchPostMessage(action: { type: string, payload: ApiTypes.Feed.PostMessage }) {
  const response = yield API.feed.postMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.postFeedMessageSucces(true))
    yield put(Actions.feed.getFeedMessageUploadLinkSucces(null))
    
    if ( !action.payload.body.group_id) {
      yield put(Actions.feed.getFeedTokensRequest())
    } else {
      console.log("I'm here!")
      const state = yield select()
      const groupMsgToken = selectors.groups.groupMessageToken(state)
      const feedsTokens = selectors.feed.feedsTokens(state)
      let msgToken: string = ""
      feedsTokens.map( (item: CommonTypes.HubTypes.CurrentHub ) => {
        if(item.host === groupMsgToken.host)
          msgToken = item.token
      })
  
      yield put(Actions.groups.getGroupFeedRequest({
        host: action.payload.host,
        body: {
          token: msgToken,
          group_id: action.payload.body.group_id? action.payload.body.group_id : ""
        }
      }))
    }
  } 
}

export function* watchDeleteMessage(action: { type: string, payload: ApiTypes.Feed.DeleteMessage }) {
  const response = yield API.feed.deleteMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.deleteFeedMessageSucces())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchEditMessage(action: { type: string, payload: ApiTypes.Feed.EditMessage }) {
  const response = yield API.feed.editMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.editFeedMessageSucces())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchPostComment(action: { type: string, payload: ApiTypes.Feed.PostComment }) {
  const response = yield API.feed.postComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.postFeedCommentSucces(true))
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchEditComment(action: { type: string, payload: ApiTypes.Feed.EditComment }) {
  const response = yield API.feed.editComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.editFeedCommentSucces())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDeleteComment(action: { type: string, payload: ApiTypes.Feed.DeleteComment }) {
  const response = yield API.feed.deleteComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.deleteFeedCommentSucces())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetMessageUploadLink(action: { type: string, payload: ApiTypes.Feed.UploadLinkRequest }) {
  const response = yield API.feed.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.getFeedMessageUploadLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetMessagesByIdFromHub(action: { type: string, payload: ApiTypes.Feed.MessagesById }) {
  const response = yield API.feed.getMessageById(action.payload)

  if (response.status === 200) {
    const message = response.data.message
    message.sourceHost = action.payload.host
    message.messageToken = action.payload.body.token
    yield put(Actions.feed.getFeedMessagesByIdFromHubSuccess(message))
  } else {
    yield put(Actions.feed.getFeedMessagesByIdFromHubFailed())
  }
}

export function* watchSetAttachment(action: { type: string, payload: ApiTypes.Feed.Attachment }) {
  const response = yield API.feed.setAttachment(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.feed.setAttachmentSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchLikeMessage(action: { type: string, payload: ApiTypes.Feed.Like }) {
  const response = yield API.feed.likeMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.linkFeedMessageSuccess())
    yield put(Actions.feed.getFeedTokensRequest())
    yield put(Actions.feed.getLikesForFeedMessageRequest(action.payload))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchLikeComment(action: { type: string, payload: ApiTypes.Feed.Like }) {
  const response = yield API.feed.likeComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.linkFeedCommentSuccess())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchHideMessage(action: { type: string, payload: ApiTypes.Feed.Hide }) {
  const response = yield API.feed.hideMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.hideFeedMessageSuccess())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchHideComment(action: { type: string, payload: ApiTypes.Feed.Hide }) {
  const response = yield API.feed.hideComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.hideFeedCommentSuccess())
    yield put(Actions.feed.getFeedTokensRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetLikesForMessage(action: { type: string, payload: ApiTypes.Feed.Like }) {
  const response = yield API.feed.getlikesForMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.getLikesForFeedMessageSuccess({
      id: action.payload.id,
      likes: response.data?.likes || []
    }))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetLikesForComment(action: { type: string, payload: ApiTypes.Feed.Like }) {
  const response = yield API.feed.getlikesForComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.getLikesForFeedCommentSuccess({
      id: action.payload.id,
      likes: response.data?.likes || []
    }))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchReportMessageHub(action: { type: string, payload: ApiTypes.Feed.ReportMessageHub }) {
  const response = yield API.feed.reportMessageHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.reportFeedMessageCentralRequest({
      hub_id: action.payload.host,
      report_id: response.data?.report_id
    }))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchReportMessageCentral(action: { type: string, payload: ApiTypes.Feed.ReportMessageCentral }) {
  const response = yield API.feed.reportMessageCentral(action.payload)

  if (response.status === 200) {
    yield put(Actions.feed.reportFeedMessageSucces())
    yield put(Actions.common.setSuccessNotify('Sent successfully'))

  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}
