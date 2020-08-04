import { all, takeEvery } from 'redux-saga/effects'
import { Types as RegistrationTypes } from '@store/registration/actions'
import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { Types as FriendTypes } from '@store/friends/actions'
import { Types as NodeTypes } from '@store/nodes/actions'
import { Types as ProfileTypes } from '@store/profile/actions'
import { Types as MessagesTypes } from '@store/messages/actions'
import { Types as NotificationsTypes } from '@store/notifications/actions'

import {
    watchlogin,
    watchlogout,
    watchGetAuthToken,
} from './authorization'
import {
    watchSendConfirmLink,
    watchConfirmUser,
    watchRegisterUser,
} from './registration'
import {
    watchGetFriends,
    watchGetFriendsOfFriends,
    watchAddFriend,
    watchGetInvitations,
    watchAcceptInvitation,
    watchRejectInvitation,
    watchCreateInviteByEmail,
} from './friends'
import {
    watchNodeCreate,
    watchGetNodes,
    watchApproveNode,
    watchRemoveNode,
} from './nodes'
import {
    watchGetProfile,
    watchGetUploadLink,
    watchSetAvatar,
    watchEditProfile,
} from './profile'
import {
    watchGetMessages,
    watchGetCurrentNode,
    watchPostMessage,
    watchGetMessagesFromNode,
    watchDeleteMessage,
    watchEditMessage,
    watchPostComment,
    watchEditComment,
    watchDeleteComment,
    watchGetMessageUploadLink,
    watchSetAttachment,
} from './messages'
import {
    watchGetNotifications,
} from './notifications'

export function* rootSaga() {
    yield all([
        takeEvery(RegistrationTypes.SEND_CONFIRM_LINK_REQUEST, watchSendConfirmLink),
        takeEvery(RegistrationTypes.CONFIRM_USER_REQUEST, watchConfirmUser),
        takeEvery(RegistrationTypes.REGISTER_USER_REQUEST, watchRegisterUser),

        takeEvery(AuthorizationTypes.LOGIN_REQUEST, watchlogin),
        takeEvery(AuthorizationTypes.LOGOUT_REQUEST, watchlogout),
        takeEvery(AuthorizationTypes.GET_AUTH_TOKEN_REQUEST, watchGetAuthToken),

        takeEvery(FriendTypes.GET_FRIENDS_REQUEST, watchGetFriends),
        takeEvery(FriendTypes.GET_FRIENDS_OF_FRIENDS_REQUEST, watchGetFriendsOfFriends),
        takeEvery(FriendTypes.ADD_FRIEND_REQUEST, watchAddFriend),
        takeEvery(FriendTypes.GET_INVITATIONS_REQUEST, watchGetInvitations),
        takeEvery(FriendTypes.ACCEPT_INVITATION_REQUEST, watchAcceptInvitation),
        takeEvery(FriendTypes.REJECT_INVITATION_REQUEST, watchRejectInvitation),
        takeEvery(FriendTypes.INVITE_BY_EMAIL_REQUEST, watchCreateInviteByEmail),

        takeEvery(NodeTypes.NODE_CREATE_REQUEST, watchNodeCreate),
        takeEvery(NodeTypes.GET_NODES_REQUEST, watchGetNodes),
        takeEvery(NodeTypes.APPROVE_NODE_REQUEST, watchApproveNode),
        takeEvery(NodeTypes.REMOVE_NODE_REQUEST, watchRemoveNode),

        takeEvery(ProfileTypes.GET_PROFILE_REQUEST, watchGetProfile),
        takeEvery(ProfileTypes.GET_UPLOAD_LINK_REQUEST, watchGetUploadLink),
        takeEvery(ProfileTypes.SET_AVATAR_REQUEST, watchSetAvatar),
        takeEvery(ProfileTypes.EDIT_PROFILE_REQUEST, watchEditProfile),

        takeEvery(MessagesTypes.GET_MESSAGES_REQUEST, watchGetMessages),
        takeEvery(MessagesTypes.GET_CURRENT_NODE_REQUEST, watchGetCurrentNode),
        takeEvery(MessagesTypes.POST_MESSAGE_REQUEST, watchPostMessage),
        takeEvery(MessagesTypes.GET_MESSAGES_FROM_NODE_REQUEST, watchGetMessagesFromNode),
        takeEvery(MessagesTypes.DELETE_MESSAGE_REQUEST, watchDeleteMessage),
        takeEvery(MessagesTypes.EDIT_MESSAGE_REQUEST, watchEditMessage),
        takeEvery(MessagesTypes.POST_COMMENT_REQUEST, watchPostComment),
        takeEvery(MessagesTypes.EDIT_COMMENT_REQUEST, watchEditComment),
        takeEvery(MessagesTypes.DELETE_COMMENT_REQUEST, watchDeleteComment),
        takeEvery(MessagesTypes.GET_MESSAGE_UPLOAD_LINK_REQUEST, watchGetMessageUploadLink),
        takeEvery(MessagesTypes.SET_MESSAGE_ATTACHMENT_REQUEST, watchSetAttachment),
        
        takeEvery(NotificationsTypes.GET_NOTIFICATIONS_REQUEST, watchGetNotifications),
    ])
}