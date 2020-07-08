import { all, takeEvery } from 'redux-saga/effects'

import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { Types as FriendTypes } from '@store/friends/actions'
import { Types as NodeTypes } from '@store/nodes/actions'

import { watchlogin, watchlogout } from './authorization'
import { 
    watchGetFriends, 
    watchGetFriendsOfFriends,
    watchAddFriend,
    watchGetInvitations,
    watchAcceptInvitation,
    watchRejectInvitation,
} from './friends'

import { 
    watchNodeCreate, 
    watchGetNodes, 
    watchApproveNode,
    watchRemoveNode,
} from './nodes'

export function* rootSaga() {
    yield all([
        takeEvery(AuthorizationTypes.LOGIN_REQUEST, watchlogin),
        takeEvery(AuthorizationTypes.LOGOUT_REQUEST, watchlogout),
        takeEvery(FriendTypes.GET_FRIENDS_REQUEST, watchGetFriends),
        takeEvery(FriendTypes.GET_FRIENDS_OF_FRIENDS_REQUEST, watchGetFriendsOfFriends),
        takeEvery(FriendTypes.ADD_FRIEND_REQUEST, watchAddFriend),
        takeEvery(FriendTypes.GET_INVITATIONS_REQUEST, watchGetInvitations),
        takeEvery(FriendTypes.ACCEPT_INVITATION_REQUEST, watchAcceptInvitation),
        takeEvery(FriendTypes.REJECT_INVITATION_REQUEST, watchRejectInvitation),
        takeEvery(NodeTypes.NODE_CREATE_REQUEST, watchNodeCreate),
        takeEvery(NodeTypes.GET_NODES_REQUEST, watchGetNodes),
        takeEvery(NodeTypes.APPROVE_NODE_REQUEST, watchApproveNode),
        takeEvery(NodeTypes.REMOVE_NODE_REQUEST, watchRemoveNode),
    ])
}