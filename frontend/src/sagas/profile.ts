import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'

export function* watchGetProfile() {
  const response = yield API.profile.getProfile()

  if (response.status === 200) {
    localStorage.setItem('kotoProfile', JSON.stringify(response.data))
    yield put(Actions.profile.getProfileSucces(response.data))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}
