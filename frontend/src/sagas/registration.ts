import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from './../types'

export function* watchSendConfirmLink() {
  const response = yield API.registration.sendConfirmLink()
  if (response.status === 200) {
    yield put(Actions.notify.setSuccessNotify('Sent successfully, please check your mail.'))
    yield put(Actions.registration.sendConfirmLinkSucces())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchConfirmUser(action: { type: string, payload: ApiTypes.Token }) {
  const response = yield API.registration.confirmUser(action.payload)
  
  if (response.status === 200) {
    localStorage.setItem('kotoIsLogged', 'true')
    yield put(Actions.profile.getProfileRequest())
    yield put(Actions.authorization.getAuthTokenRequest())
    yield put(Actions.authorization.loginSucces())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}
