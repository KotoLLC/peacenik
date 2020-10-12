import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'

export function* watchGetProfile() {
  const response = yield API.profile.getProfile()

  if (response.status === 200 && response.data) {
    if (response.data?.user?.is_confirmed) {
      yield put(Actions.authorization.getAuthTokenRequest())
    }

    yield put(Actions.profile.getProfileSucces(response.data))
    const user = Object.assign({}, response.data.user)
    delete user.email
    localStorage.setItem('kotoProfile', JSON.stringify({user}))
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  }
}

export function* watchGetUploadLink(action: { type: string, payload: ApiTypes.Profile.UploadLinkRequest }) {
  const response = yield API.profile.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getUploadLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchSetAvatar(action: { type: string, payload: ApiTypes.Profile.Avatar }) {
  const response = yield API.profile.setAvatar(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.profile.setAvatarSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchEditProfile(action: { type: string, payload: ApiTypes.Profile.EditProfile }) {
  const response = yield API.profile.editProfile(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getProfileRequest())
    yield put(Actions.profile.resetProfileErrorMessage())
    yield put(Actions.profile.editProfileSuccess(true))
    yield put(Actions.common.setSuccessNotify('Changes have been saved'))
    setTimeout(() => window.location.reload(), 1500)
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.profile.editProfileFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetUsers(action: { type: string, payload: string[] }) {
  const response = yield API.profile.getUsers(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getUsersSucces(response.data?.users))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDisableUser(action: { type: string, payload: string }) {
  const response = yield API.profile.disableUser(action.payload)

  if (response.status === 200) {
    yield put(Actions.authorization.getAuthTokenRequest())
    yield put(Actions.messages.cleanAllMessages())
    yield put(Actions.messages.getMessagesRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}