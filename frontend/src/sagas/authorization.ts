import { put, takeLatest } from 'redux-saga/effects'
import Actions from '@store/actions'
import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { ApiDataTypes } from '../types/index'
import { API } from '@services/api'

// export function* watchlogin(action: { type: AuthorizationTypes.LOGIN_REQUESTED, payload: ApiDataTypes.Login }) {
//   const response = yield API.authorization.login(action.payload)

//   if (response.data) {
//     yield put(Actions.authorization.loginSucces())
//   } else {
//     yield put(Actions.authorization.loginFailed('Server error'))
//   }
// }

export function* login(action: { type: AuthorizationTypes.LOGIN_REQUESTED, payload: ApiDataTypes.Login }) {
  const response = yield API.authorization.login(action.payload)

  if (response.data) {
    yield put(Actions.authorization.loginSucces())
  } else {
    yield put(Actions.authorization.loginFailed('Unknown error'))
  }
}
export function* watchLogin() {
  yield takeLatest(AuthorizationTypes.LOGIN_REQUESTED, login)
}