import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { Types as FriendsTypes } from '@store/friends/actions'
import { API } from '@services/api'

export function* watchGetFriends(action: { type: FriendsTypes.GET_FRIENDS_REQUEST }) {
  const response = yield API.friends.getFriends()

  if (response.status === 200) {
    yield put(Actions.friends.getFriendsSucces(response.data.friends || []))
  } else {
    yield put(Actions.notify.setErrorNotify(response.error.response.data.msg || 'Server error'))
  }
}