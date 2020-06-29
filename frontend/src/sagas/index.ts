import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { all, takeEvery } from 'redux-saga/effects'
import { watchlogin, watchlogout } from './authorization'

export function* rootSaga() {
    yield all([
        takeEvery(AuthorizationTypes.LOGIN_REQUESTED, watchlogin),
        takeEvery(AuthorizationTypes.LOGOUT_REQUESTED, watchlogout),
    ])
}