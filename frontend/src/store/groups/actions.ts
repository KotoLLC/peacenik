
import { ApiTypes } from 'src/types'

export enum Types {
  ADD_GROUP_REQUEST = 'ADD_GROUP_REQUEST',
  ADD_GROUP_SUCCESS = 'ADD_GROUP_SUCCESS',
  
  EDIT_GROUP_REQUEST = 'EDIT_GROUP_REQUEST',
  EDIT_GROUP_SUCCESS = 'EDIT_GROUP_SUCCESS',
  
  GET_MY_GROUPS_REQUEST = 'GET_MY_GROUPS_REQUEST',
  GET_MY_GROUPS_SUCCESS = 'GET_MY_GROUPS_SUCCESS',
  
  GET_PUBLIC_GROUPS_REQUEST = 'GET_PUBLIC_GROUPS_REQUEST',
  GET_PUBLIC_GROUPS_SUCCESS = 'GET_PUBLIC_GROUPS_SUCCESS',

  GET_GROUP_DETAILS_REQUEST = 'GET_GROUP_DETAILS_REQUEST',
  GET_GROUP_DETAILS_SUCCESS = 'GET_GROUP_DETAILS_SUCCESS',
  
  DELETE_GROUP_REQUEST = 'DELETE_GROUP_REQUEST',
  DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS',
  
  JOIN_TO_GROUP_REQUEST = 'JOIN_TO_GROUP_REQUEST',
  JOIN_TO_GROUP_SUCCESS = 'JOIN_TO_GROUP_SUCCESS',

  GET_INVITES_TO_CONFIRM_REQUEST = 'GET_INVITES_TO_CONFIRM_REQUEST',
  GET_INVITES_TO_CONFIRM_SUCCESS = 'GET_INVITES_TO_CONFIRM_SUCCESS',
  
  CONFIRM_INVITE_REQUEST = 'CONFIRM_INVITE_REQUEST',
  CONFIRM_INVITE_SUCCESS = 'CONFIRM_INVITE_SUCCESS',
  
  DENY_INVITE_REQUEST = 'DENY_INVITE_REQUEST',
  DENY_INVITE_SUCCESS = 'DENY_INVITE_SUCCESS',

  DELETE_MEMBER_REQUEST = 'DELETE_MEMBER_REQUEST',
  DELETE_MEMBER_SUCCESS = 'DELETE_MEMBER_SUCCESS',

  LEAVE_GROUP_REQUEST = 'LEAVE_GROUP_REQUEST',
  LEAVE_GROUP_SUCCESS = 'LEAVE_GROUP_SUCCESS',

  SET_CURRENT_GROUP_ID = 'SET_CURRENT_GROUP_ID',

  DELETE_JOIN_REQUEST = 'DELETE_JOIN_REQUEST',
  DELETE_JOIN_SUCCESS = 'DELETE_JOIN_SUCCESS',

  GET_GROUP_COVER_UPLOAD_LINK_REQUEST = 'GET_GROUP_COVER_UPLOAD_LINK_REQUEST',
  GET_GROUP_COVER_UPLOAD_LINK_SUCCESS = 'GET_GROUP_COVER_UPLOAD_LINK_SUCCESS',

  SET_GROUP_COVER_REQUEST = 'SET_GROUP_COVER_REQUEST',  
  SET_GROUP_COVER_SUCCESS = 'SET_GROUP_COVER_SUCCESS',  
  
  GET_AVATAR_UPLOAD_LINK_REQUEST = 'GET_AVATAR_UPLOAD_LINK_REQUEST',
  GET_AVATAR_UPLOAD_LINK_SUCCESS = 'GET_AVATAR_UPLOAD_LINK_SUCCESS',

  SET_AVATAR_REQUEST = 'SET_AVATAR_REQUEST',  
  SET_AVATAR_SUCCESS = 'SET_AVATAR_SUCCESS',  

  ADD_USER_TO_GROUP_REQUEST = 'ADD_USER_TO_GROUP_REQUEST',

  GET_GROUP_FEED_REQUEST = 'GET_GROUP_FEED_REQUEST',
  GET_GROUP_FEED_SUCCESS = 'GET_GROUP_FEED_SUCCESS',

  GET_GROUP_MSG_TOKEN = 'GET_GROUP_MSG_TOKEN',

  GET_GROUP_FEED_TOKEN_REQUEST = 'GET_GROUP_FEED_TOKEN_REQUEST',
  SET_GROUP_FEED_TOKEN = 'SET_GROUP_FEED_TOKEN',
}

const addGroupRequest = (payload: ApiTypes.Groups.AddGroup) => ({
  type: Types.ADD_GROUP_REQUEST,
  payload
})

const addGroupSucces = (payload: boolean) => ({
  type: Types.ADD_GROUP_SUCCESS,
  payload
})

const editGroupRequest = (payload: ApiTypes.Groups.EditGroup) => ({
  type: Types.EDIT_GROUP_REQUEST,
  payload
})

const editGroupSuccess = (payload: boolean) => ({
  type: Types.EDIT_GROUP_SUCCESS,
  payload
})

const getMyGroupsRequest = () => ({
  type: Types.GET_MY_GROUPS_REQUEST,
})

const getMyGroupsSuccess = (payload: ApiTypes.Groups.RecievedGroup[]) => ({
  type: Types.GET_MY_GROUPS_SUCCESS,
  payload
})

const getPublicGroupsRequest = () => ({
  type: Types.GET_PUBLIC_GROUPS_REQUEST,
})

const getPublicGroupsSuccess = (payload: ApiTypes.Groups.RecievedGroup[]) => ({
  type: Types.GET_PUBLIC_GROUPS_SUCCESS,
  payload
})

const getGroupDetailsRequest = (payload: string) => ({
  type: Types.GET_GROUP_DETAILS_REQUEST,
  payload
})

const getGroupDetailsSuccess = (payload: ApiTypes.Groups.GroupDetails) => ({
  type: Types.GET_GROUP_DETAILS_SUCCESS,
  payload
})

const deleteGroupRequest = (payload: string) => ({
  type: Types.DELETE_GROUP_REQUEST,
  payload
})

const deleteGroupSuccess = (payload: boolean) => ({
  type: Types.DELETE_GROUP_SUCCESS,
  payload
})

const joinToGroupRequest = (payload: ApiTypes.Groups.RequestJoin) => ({
  type: Types.JOIN_TO_GROUP_REQUEST,
  payload
})

const joinToGroupSuccess = (payload: boolean) => ({
  type: Types.JOIN_TO_GROUP_SUCCESS,
  payload
})

const getInvitesToConfirmRequest = () => ({
  type: Types.GET_INVITES_TO_CONFIRM_REQUEST,
})

const getInvitesToConfirmSuccess = (payload: ApiTypes.Groups.InviteToConfirm[]) => ({
  type: Types.GET_INVITES_TO_CONFIRM_SUCCESS,
  payload
})

const confirmInviteRequest = (payload: ApiTypes.Groups.ConfirmDenyInvite) => ({
  type: Types.CONFIRM_INVITE_REQUEST,
  payload
})

const confirmInviteSuccess = (payload: boolean) => ({
  type: Types.CONFIRM_INVITE_SUCCESS,
  payload
})

const denyInviteRequest = (payload: ApiTypes.Groups.ConfirmDenyInvite) => ({
  type: Types.DENY_INVITE_REQUEST,
  payload
})

const denyInviteSuccess = (payload: boolean) => ({
  type: Types.DENY_INVITE_SUCCESS,
  payload
})

const deleteMemberRequest = (payload: ApiTypes.Groups.DeleteMember) => ({
  type: Types.DELETE_MEMBER_REQUEST,
  payload
})

const deleteMemberSuccess = (payload: boolean) => ({
  type: Types.DELETE_MEMBER_SUCCESS,
  payload
})

const leaveGroupRequest = (payload: string) => ({
  type: Types.LEAVE_GROUP_REQUEST,
  payload
})

const leaveGroupSuccess = (payload: boolean) => ({
  type: Types.LEAVE_GROUP_SUCCESS,
  payload
})

const setCurrentGroupId = (payload: string) => ({
  type: Types.SET_CURRENT_GROUP_ID,
  payload
})

const deleteJoinRequest = (payload: ApiTypes.Groups.DeleteJoinRequest) => ({
  type: Types.DELETE_JOIN_REQUEST,
  payload
})

const deleteJoinSuccess = (payload: boolean) => ({
  type: Types.DELETE_JOIN_SUCCESS,
  payload
})

const getGroupCoverUploadLinkRequest = (payload: ApiTypes.UploadLinkRequest) => ({
  type: Types.GET_GROUP_COVER_UPLOAD_LINK_REQUEST,
  payload,
})

const getGroupCoverUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
  type: Types.GET_GROUP_COVER_UPLOAD_LINK_SUCCESS,
  payload
})

const setGroupCoverRequest = (payload: ApiTypes.Groups.Image) => ({
  type: Types.SET_GROUP_COVER_REQUEST,
  payload,
})

const setGroupCoverSuccess = () => ({
  type: Types.SET_GROUP_COVER_SUCCESS,
})

const getAvatarUploadLinkRequest = (payload: ApiTypes.UploadLinkRequest) => ({
  type: Types.GET_AVATAR_UPLOAD_LINK_REQUEST,
  payload,
})

const getAvatarUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
  type: Types.GET_AVATAR_UPLOAD_LINK_SUCCESS,
  payload
})

const setAvatarRequest = (payload: ApiTypes.Groups.Image) => ({
  type: Types.SET_AVATAR_REQUEST,
  payload,
})

const setAvatarSuccess = () => ({
  type: Types.SET_AVATAR_SUCCESS,
})

const addUserToGroupRequest = (payload: ApiTypes.Groups.AddUserToGroup) => ({
  type: Types.ADD_USER_TO_GROUP_REQUEST,
  payload,
})

const getMsgTokenRequest = () => ({
  type:Types.GET_GROUP_MSG_TOKEN
})

const getGroupFeedRequest = (payload: ApiTypes.Groups.MessagesById) => ({
  type: Types.GET_GROUP_FEED_REQUEST,
  payload
})

const getGroupFeedTokenRequest = (payload: ApiTypes.Groups.MessagesById) => ({
  type: Types.GET_GROUP_FEED_TOKEN_REQUEST,
  payload
})

const setGroupFeedToken = (payload: Object) => ({
  type: Types.SET_GROUP_FEED_TOKEN,
  payload
})

const getGroupFeedFromHubSuccess = (payload: {
  hub: string
  messages: ApiTypes.Feed.Message[]
  group_id: string
}) => ({
  type: Types.GET_GROUP_FEED_SUCCESS,
  payload
})

export default {
  addGroupRequest,
  addGroupSucces,
  getMyGroupsRequest,
  getMyGroupsSuccess,
  getPublicGroupsRequest,
  getPublicGroupsSuccess,
  editGroupRequest,
  editGroupSuccess,
  getGroupDetailsRequest,
  getGroupDetailsSuccess,
  deleteGroupRequest,
  deleteGroupSuccess,
  joinToGroupRequest,
  joinToGroupSuccess,
  getInvitesToConfirmRequest,
  getInvitesToConfirmSuccess,
  confirmInviteRequest,
  confirmInviteSuccess,
  denyInviteRequest,
  denyInviteSuccess,
  deleteMemberRequest,
  deleteMemberSuccess,
  leaveGroupRequest,
  leaveGroupSuccess,
  setCurrentGroupId,
  deleteJoinRequest,
  deleteJoinSuccess,
  getGroupCoverUploadLinkRequest,
  getGroupCoverUploadLinkSucces,
  setGroupCoverRequest,
  setGroupCoverSuccess,
  getAvatarUploadLinkRequest,
  getAvatarUploadLinkSucces,
  setAvatarRequest,
  setAvatarSuccess,
  addUserToGroupRequest,
  getGroupFeedRequest,
  getMsgTokenRequest,
  getGroupFeedTokenRequest,
  setGroupFeedToken,
  getGroupFeedFromHubSuccess,
}