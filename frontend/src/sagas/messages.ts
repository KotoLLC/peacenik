import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from './../types'
import { currentNodeBack2Front } from '@services/dataTransforms/currentNodeTransform'
import { nodesForMessagesBack2Front } from '@services/dataTransforms/nodesForMessagesTransform'
import { Types as MessagesTypes } from '@store/messages/actions'

export function* watchGetMessages() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    const messageTokens = nodesForMessagesBack2Front(response.data?.tokens)
    yield put(Actions.messages.getMessagesSucces(messageTokens))

    yield all(messageTokens.map(item => call(watchGetMessagesFromNode, {
      type: MessagesTypes.GET_MESSAGES_FROM_NODE_REQUEST,
      payload: {
        host: item.host,
        body: {
          token: item.token,
        }
      },
    })))

  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchGetCurrentNode() {
  const response = yield API.messages.getCurrentNode()

  if (response.status === 200) {
    yield put(Actions.messages.getCurrentNodeSucces(currentNodeBack2Front(response.data?.tokens)))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchGetMessagesFromNode(action: { type: string, payload: ApiTypes.Messages.MessagesFromNode }) {
  const response = yield API.messages.getMessagesFromNode(action.payload)

  if (response.status === 200) {
    let resultData = []
    if (response.data?.messages?.length) {
      resultData = response.data?.messages.map(item => {
        item.sourceHost = action.payload.host
        item.messageToken = action.payload.body.token
        return item
      })
    }
    yield put(Actions.messages.getMessagesFromNodeSucces(resultData))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchPostMessage(action: { type: string, payload: ApiTypes.Messages.PostMessage }) {
  const response = yield API.messages.postMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.postMessageSucces(true))
    yield put(Actions.messages.getMessagesRequest())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchDeleteMessage(action: { type: string, payload: ApiTypes.Messages.DeleteMessage }) {
  const response = yield API.messages.deleteMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.deleteMessageSucces())
    yield put(Actions.messages.getMessagesRequest())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchEditMessage(action: { type: string, payload: ApiTypes.Messages.EditMessage }) {
  const response = yield API.messages.editMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.deleteMessageSucces())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchPostComment(action: { type: string, payload: ApiTypes.Messages.PostComment }) {
  const response = yield API.messages.postComment(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.postCommentSucces(true))
    yield put(Actions.messages.getMessagesRequest())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}
