import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from './../types'

export function* watchGetProfile() {
  const response = yield API.profile.getProfile()

  if (response.status === 200) {
    localStorage.setItem('kotoProfile', JSON.stringify(response.data))
    yield put(Actions.profile.getProfileSucces(response.data))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchGetUploadLink(action: { type: string, payload: string }) {
  const response = yield API.profile.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getUploadLinkSucces(response.data))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}

export function* watchSetAvatar(action: { type: string, payload: ApiTypes.Avatar}) {
  const response = yield API.profile.setAvatar(action.payload.link, action.payload.form_data)
  if (response.status === 204 || response.status === 200) {
    yield put(Actions.profile.setAvatarSuccess())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data || 'Server error'))
  }
}
