
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
}