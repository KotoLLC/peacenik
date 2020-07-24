
import { ApiTypes } from './../../types'

export enum Types {
  GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS',
  
  GET_UPLOAD_LINK_REQUEST = 'GET_UPLOAD_LINK_REQUEST',
  GET_UPLOAD_LINK_SUCCESS = 'GET_UPLOAD_LINK_SUCCESS',

  SET_AVATAR_REQUEST = 'SET_AVATAR_REQUEST',
  SET_AVATAR_SUCCESS = 'SET_AVATAR_SUCCESS',
}

const getProfileRequest = () => ({
  type: Types.GET_PROFILE_REQUEST,
})

const getProfileSucces = (payload: ApiTypes.Profile) => ({
  type: Types.GET_PROFILE_SUCCESS,
  payload
})

const getUploadLinkRequest = (payload: string) => ({
  type: Types.GET_UPLOAD_LINK_REQUEST,
  payload,
})

const getUploadLinkSucces = (payload: ApiTypes.UploadLink) => ({
  type: Types.GET_UPLOAD_LINK_SUCCESS,
  payload
})

const setAvatarRequest = (payload: ApiTypes.Avatar) => ({
  type: Types.SET_AVATAR_REQUEST,
  payload,
})

const setAvatarSuccess = () => ({
  type: Types.SET_AVATAR_SUCCESS,
})

export default {
  getProfileRequest,
  getProfileSucces,
  getUploadLinkRequest,
  getUploadLinkSucces, 
  setAvatarRequest,
  setAvatarSuccess,
}