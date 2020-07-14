import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from './../types'
import { currentNodeBack2Front } from '@services/dataTransforms/currentNodeTransform'
import { nodesForMessagesBack2Front } from '@services/dataTransforms/nodesForMessagesTransform'
// import { checkUniqMessage } from '@services/dataTransforms/checkUniqMessage'

export function* watchGetMessages() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    yield put(Actions.messages.getMessagesSucces(nodesForMessagesBack2Front(response.data?.tokens)))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetCurrentNode() {
  const response = yield API.messages.getCurrentNode()

  if (response.status === 200) {
    yield put(Actions.messages.getCurrentNodeSucces(currentNodeBack2Front(response.data?.tokens)))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchPostMessage(action: { type: string, payload: ApiTypes.Messages.PostMessage }) {
  const response = yield API.messages.postMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.postMessageSucces(true))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetMessagesFromNode(action: { type: string, payload: ApiTypes.Messages.MessagesFromNode }) {
  const response = yield API.messages.getMessagesFromNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.messages.getMessagesFromNodeSucces(response.data?.messages))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}