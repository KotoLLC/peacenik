import { all, takeEvery } from 'redux-saga/effects'
import { Types as RegistrationTypes } from '@store/registration/actions'
import { Types as AuthorizationTypes } from '@store/authorization/actions'
import { Types as FriendTypes } from '@store/friends/actions'
import { Types as HubTypes } from '@store/hubs/actions'
import { Types as ProfileTypes } from '@store/profile/actions'
import { Types as MessagesTypes } from '@store/messages/actions'
import { Types as NotificationsTypes } from '@store/notifications/actions'
import { Types as DashboardTypes } from '@store/dashboard/actions'
import { Types as GroupsTypes } from '@store/groups/actions'

import {
    watchlogin,
    watchlogout,
    watchGetAuthToken,
    watchForgotPassword,
    watchResetPassword,
    watchForgotUserName,
} from './authorization'
import {
    watchSendConfirmLink,
    watchConfirmUser,
    watchRegisterUser,
    watchIsUserRegisteredChecking,
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
    watchHubCreate,
    watchGetHubs,
    watchApproveHub,
    watchRemoveHub,
} from './hubs'
import {
    watchGetProfile,
    watchGetUploadLink,
    watchSetAvatar,
    watchEditProfile,
    watchGetUsers,
    watchDisableUser,
} from './profile'
import {
    watchGetMessages,
    watchGetCurrentHub,
    watchPostMessage,
    watchGetMessagesFromHub,
    watchDeleteMessage,
    watchEditMessage,
    watchPostComment,
    watchEditComment,
    watchDeleteComment,
    watchGetMessageUploadLink,
    watchSetAttachment,
    watchLikeMessage,
    watchLikeComment,
    watchGetLikesForMessage,
    watchGetLikesForComment,
    watchGetMoreMessages,
    watchGetMoreMessagesFromHub,
    watchGetMessagesByIdFromHub,
    watchHideMessage,
    watchHideComment,
    watchReportMessageHub,
    watchReportMessageCentral,
} from './messages'
import {
    watchGetNotifications,
    watchCleanNotificationsInUserHub,
    watchCleanNotificationsInHub,
    watchMarkAsReadNotificationsInUserHub,
    watchMarkAsReadNotificationsInHub,
} from './notifications'
import {  
    watchGetMessageReports,
    watchGetMessageReportsFromHub,
    watchResolveReport,
    watchDeleteReportedMessage,
    watchBlockReportedUser,
    watchBlockUser,
} from './dashboard'
import {
    watchAddGroup,
    watchGetMyGroups,
    watchGetPublicGroups,
    watchEditGroup,
    watchGetGroupDetails,
    watchDeleteGroup,
    watchRequestJounGroup,
    watchGetInvitesToConfirmRequest,
    watchConfirmInviteRequest,
    watchDenyInviteRequest,
    watchDeleteMemberRequest,
} from './groups'

export function* rootSaga() {
    yield all([
        takeEvery(RegistrationTypes.SEND_CONFIRM_LINK_REQUEST, watchSendConfirmLink),
        takeEvery(RegistrationTypes.CONFIRM_USER_REQUEST, watchConfirmUser),
        takeEvery(RegistrationTypes.REGISTER_USER_REQUEST, watchRegisterUser),
        takeEvery(RegistrationTypes.CHECK_IS_USER_REGISTERED_REQUESST, watchIsUserRegisteredChecking),

        takeEvery(AuthorizationTypes.LOGIN_REQUEST, watchlogin),
        takeEvery(AuthorizationTypes.LOGOUT_REQUEST, watchlogout),
        takeEvery(AuthorizationTypes.GET_AUTH_TOKEN_REQUEST, watchGetAuthToken),
        takeEvery(AuthorizationTypes.FORGOT_PASSWORD_REQUEST, watchForgotPassword),
        takeEvery(AuthorizationTypes.FORGOT_USERNAME_REQUEST, watchForgotUserName),
        takeEvery(AuthorizationTypes.RESET_PASSWORD_REQUEST, watchResetPassword),

        takeEvery(FriendTypes.GET_FRIENDS_REQUEST, watchGetFriends),
        takeEvery(FriendTypes.GET_FRIENDS_OF_FRIENDS_REQUEST, watchGetFriendsOfFriends),
        takeEvery(FriendTypes.ADD_FRIEND_REQUEST, watchAddFriend),
        takeEvery(FriendTypes.GET_INVITATIONS_REQUEST, watchGetInvitations),
        takeEvery(FriendTypes.ACCEPT_INVITATION_REQUEST, watchAcceptInvitation),
        takeEvery(FriendTypes.REJECT_INVITATION_REQUEST, watchRejectInvitation),
        takeEvery(FriendTypes.INVITE_BY_EMAIL_REQUEST, watchCreateInviteByEmail),

        takeEvery(HubTypes.HUB_CREATE_REQUEST, watchHubCreate),
        takeEvery(HubTypes.GET_HUBS_REQUEST, watchGetHubs),
        takeEvery(HubTypes.APPROVE_HUB_REQUEST, watchApproveHub),
        takeEvery(HubTypes.REMOVE_HUB_REQUEST, watchRemoveHub),

        takeEvery(ProfileTypes.GET_PROFILE_REQUEST, watchGetProfile),
        takeEvery(ProfileTypes.GET_UPLOAD_LINK_REQUEST, watchGetUploadLink),
        takeEvery(ProfileTypes.SET_AVATAR_REQUEST, watchSetAvatar),
        takeEvery(ProfileTypes.EDIT_PROFILE_REQUEST, watchEditProfile),
        takeEvery(ProfileTypes.GET_USERS_REQUEST, watchGetUsers),
        takeEvery(ProfileTypes.DISABLE_USER_REQUEST, watchDisableUser),

        takeEvery(MessagesTypes.GET_MESSAGES_REQUEST, watchGetMessages),
        takeEvery(MessagesTypes.GET_CURRENT_HUB_REQUEST, watchGetCurrentHub),
        takeEvery(MessagesTypes.POST_MESSAGE_REQUEST, watchPostMessage),
        takeEvery(MessagesTypes.GET_MESSAGES_FROM_HUB_REQUEST, watchGetMessagesFromHub),
        takeEvery(MessagesTypes.DELETE_MESSAGE_REQUEST, watchDeleteMessage),
        takeEvery(MessagesTypes.EDIT_MESSAGE_REQUEST, watchEditMessage),
        takeEvery(MessagesTypes.POST_COMMENT_REQUEST, watchPostComment),
        takeEvery(MessagesTypes.EDIT_COMMENT_REQUEST, watchEditComment),
        takeEvery(MessagesTypes.DELETE_COMMENT_REQUEST, watchDeleteComment),
        takeEvery(MessagesTypes.GET_MESSAGE_UPLOAD_LINK_REQUEST, watchGetMessageUploadLink),
        takeEvery(MessagesTypes.SET_MESSAGE_ATTACHMENT_REQUEST, watchSetAttachment),
        takeEvery(MessagesTypes.LIKE_MESSAGE_REQUEST, watchLikeMessage),
        takeEvery(MessagesTypes.LIKE_COMMENT_REQUEST, watchLikeComment),
        takeEvery(MessagesTypes.GET_LIKES_FOR_MESSAGE_REQUEST, watchGetLikesForMessage),
        takeEvery(MessagesTypes.GET_LIKES_FOR_COMMENT_REQUEST, watchGetLikesForComment),
        takeEvery(MessagesTypes.GET_MORE_MESSAGES_REQUEST, watchGetMoreMessages),
        takeEvery(MessagesTypes.GET_MORE_MESSAGES_FROM_HUB_REQUEST, watchGetMoreMessagesFromHub),
        takeEvery(MessagesTypes.GET_MESSAGE_BY_ID_FROM_HUB_REQUEST, watchGetMessagesByIdFromHub),
        takeEvery(MessagesTypes.HIDE_MESSAGE_REQUEST, watchHideMessage),
        takeEvery(MessagesTypes.HIDE_COMMENT_REQUEST, watchHideComment),
        takeEvery(MessagesTypes.REPORT_MESSAGE_HUB_REQUEST, watchReportMessageHub),
        takeEvery(MessagesTypes.REPORT_MESSAGE_CENTRAL_REQUEST, watchReportMessageCentral),
        
        takeEvery(NotificationsTypes.GET_NOTIFICATIONS_REQUEST, watchGetNotifications),
        takeEvery(NotificationsTypes.CLEAN_NOTIFICATIONS_IN_USER_HUB_REQUEST, watchCleanNotificationsInUserHub),
        takeEvery(NotificationsTypes.CLEAN_NOTIFICATIONS_IN_HUB_REQUEST, watchCleanNotificationsInHub),
        takeEvery(NotificationsTypes.MARK_AS_READ_NOTIFICATIONS_IN_USER_HUB_REQUEST, watchMarkAsReadNotificationsInUserHub),
        takeEvery(NotificationsTypes.MARK_AS_READ_NOTIFICATIONS_IN_HUB_REQUEST, watchMarkAsReadNotificationsInHub),
      
        takeEvery(DashboardTypes.GET_MESSAGE_REPORTS_REQUEST, watchGetMessageReports),
        takeEvery(DashboardTypes.GET_MESSAGE_REPORTS_FROM_HUB_REQUEST, watchGetMessageReportsFromHub),
        takeEvery(DashboardTypes.RESOLVE_REPORT_REQUEST, watchResolveReport),
        takeEvery(DashboardTypes.DELETE_REPORTED_MESSAGE_REQUEST, watchDeleteReportedMessage),
        takeEvery(DashboardTypes.BLOCK_REPORTED_USER_REQUEST, watchBlockReportedUser),
        takeEvery(DashboardTypes.BLOCK_USER_REQUEST, watchBlockUser),
        
        takeEvery(GroupsTypes.ADD_GROUP_REQUEST, watchAddGroup),
        takeEvery(GroupsTypes.GET_MY_GROUPS_REQUEST, watchGetMyGroups),
        takeEvery(GroupsTypes.GET_PUBLIC_GROUPS_REQUEST, watchGetPublicGroups),
        takeEvery(GroupsTypes.EDIT_GROUP_REQUEST, watchEditGroup),
        takeEvery(GroupsTypes.GET_GROUP_DETAILS_REQUEST, watchGetGroupDetails),
        takeEvery(GroupsTypes.DELETE_GROUP_REQUEST, watchDeleteGroup),
        takeEvery(GroupsTypes.JOIN_TO_GROUP_REQUEST, watchRequestJounGroup),
        takeEvery(GroupsTypes.GET_INVITES_TO_CONFIRM_REQUEST, watchGetInvitesToConfirmRequest),
        takeEvery(GroupsTypes.CONFIRM_INVITE_REQUEST, watchConfirmInviteRequest),
        takeEvery(GroupsTypes.DENY_INVITE_REQUEST, watchDenyInviteRequest),
        takeEvery(GroupsTypes.DELETE_MEMBER_REQUEST, watchDeleteMemberRequest),
    ])
}