// import { Types as AuthorizationTypes } from '@store/authorization/actions'
// import { all, takeEvery } from 'redux-saga/effects';
// import { watchlogin } from './authorization';

// export function* rootSaga() {
//     yield all([
//         takeEvery(AuthorizationTypes.LOGIN_REQUESTED, watchlogin),
//     ]);
// }

import { spawn } from 'redux-saga/effects'
import { watchLogin } from './authorization'

export function* rootSaga() {
    yield spawn(watchLogin)
}  