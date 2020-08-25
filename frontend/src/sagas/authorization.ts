import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { ApiTypes } from 'src/types'
import { API } from '@services/api'

export function* watchlogin(action: { type: string, payload: ApiTypes.Login }) {
  const response = yield API.authorization.login(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getProfileRequest())
    yield put(Actions.authorization.loginSucces())
    localStorage.setItem('kotoIsLogged', 'true')
  } else {
    yield put(Actions.authorization.loginFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchlogout() {
  localStorage.clear()
  const response = yield API.authorization.logout()

  if (response.status === 200) {
    yield put(Actions.authorization.logoutSucces())
    window.location.reload()
  }
}

export function* watchGetAuthToken() {
  const response = yield API.authorization.getAuthToken()

  if (response.status === 200) {
    if (response.data?.token) {
      localStorage.setItem('kotoAuthToken', JSON.stringify(response.data?.token))
      localStorage.setItem('kotoAuthTokenDate', JSON.stringify(new Date()))
      yield put(Actions.authorization.getAuthTokenSucces(response.data?.token))
    }
  }
}

export function* watchResetPassword(action: { type: string, payload: ApiTypes.ResetPassword }) {
  const response = yield API.authorization.forgotPassword(action.payload)

  if (response.status === 200) {
    yield put(Actions.authorization.forgotPasswordSuccess())
  } else {
    yield put(Actions.authorization.forgotPasswordFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}