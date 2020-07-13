import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'

export function* watchGetMessages() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {

    localStorage.setItem('messageTokens', JSON.stringify(response.data))

    yield put(Actions.messages.getMessagesSucces(response.data))
  } else {
    yield put(Actions.authorization.loginFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetNodeToken() {
  const response = yield API.messages.getNodeToken()

  if (response.status === 200) {
    yield put(Actions.messages.getCurrentTokenSucces(response.data?.tokens))
  } else {
    yield put(Actions.authorization.loginFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}