import { all, takeEvery } from 'redux-saga/effects'

import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { Types as FriendsTypes } from '@store/friends/actions'

import { watchlogin, watchlogout } from './authorization'
import { watchGetFriends, watchGetFriendsOfFriends } from './friends'

export function* rootSaga() {
    yield all([
        takeEvery(AuthorizationTypes.LOGIN_REQUEST, watchlogin),
        takeEvery(AuthorizationTypes.LOGOUT_REQUEST, watchlogout),
        takeEvery(FriendsTypes.GET_FRIENDS_REQUEST, watchGetFriends),
        takeEvery(FriendsTypes.GET_FRIENDS_OF_FRIENDS_REQUEST, watchGetFriendsOfFriends),
    ])
}