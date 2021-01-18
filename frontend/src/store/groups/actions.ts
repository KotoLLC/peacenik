
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
}