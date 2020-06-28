import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { ApiTypes } from '../types/index'
import { API } from '@services/api'

export function* watchlogin(action: { type: AuthorizationTypes.LOGIN_REQUESTED, payload: ApiTypes.Login }) {
  const response = yield API.authorization.login(action.payload)

  if (response.status === 200) {
    // localStorage.setItem('koto-token', 'Bearer ');
    yield put(Actions.authorization.loginSucces())
  } else {
    yield put(Actions.authorization.loginFailed(response.error.response.data.msg || 'Server error'))
  }
}