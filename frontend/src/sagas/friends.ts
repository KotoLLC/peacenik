import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from './../types'

export function* watchGetFriends() {
  const response = yield API.friends.getFriends()

  if (response.status === 200) {
    yield put(Actions.friends.getFriendsSucces(response.data.friends || []))
  } else {
    yield put(Actions.notify.setErrorNotify(response.error.response.data.msg || 'Server error'))
  }
}

export function* watchGetFriendsOfFriends() {
  const response = yield API.friends.getFriendsOfFriends()

  if (response.status === 200) {
    yield put(Actions.friends.getFriendsOfFriendsSucces(response.data.friends || []))
  } else {
    yield put(Actions.notify.setErrorNotify(response.error.response.data.msg || 'Server error'))
  }
}

export function* watchAddFriend(action: { type: string, payload: ApiTypes.FriendRequest }) {
  const response = yield API.friends.addFriend(action.payload)

  if (response.status === 200) {
    yield put(Actions.friends.addFriendSuccess())
  } else {
    yield put(Actions.notify.setErrorNotify(response.error.response.data.msg || 'Server error'))
  }
}