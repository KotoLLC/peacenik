
import { ApiTypes } from 'src/types'

export enum Types {
  GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS',
  
  GET_UPLOAD_LINK_REQUEST = 'GET_UPLOAD_LINK_REQUEST',
  GET_UPLOAD_LINK_SUCCESS = 'GET_UPLOAD_LINK_SUCCESS',

  SET_AVATAR_REQUEST = 'SET_AVATAR_REQUEST',
  SET_AVATAR_SUCCESS = 'SET_AVATAR_SUCCESS',

  EDIT_PROFILE_REQUEST = 'EDIT_PROFILE_REQUEST',
  EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS',
  EDIT_PROFILE_FAILED = 'EDIT_PROFILE_FAILED',

  RESET_PROFILE_ERROR_MESSAGE = 'RESET_PROFILE_ERROR_MESSAGE',
}

const getProfileRequest = () => ({
  type: Types.GET_PROFILE_REQUEST,
})

const getProfileSucces = (payload: ApiTypes.Profile.UserProfile) => ({
  type: Types.GET_PROFILE_SUCCESS,
  payload
})

const getUploadLinkRequest = (payload: ApiTypes.Profile.UploadLinkRequest) => ({
  type: Types.GET_UPLOAD_LINK_REQUEST,
  payload,
})

const getUploadLinkSucces = (payload: ApiTypes.UploadLink) => ({
  type: Types.GET_UPLOAD_LINK_SUCCESS,
  payload
})

const setAvatarRequest = (payload: ApiTypes.Profile.Avatar) => ({
  type: Types.SET_AVATAR_REQUEST,
  payload,
})

const setAvatarSuccess = () => ({
  type: Types.SET_AVATAR_SUCCESS,
})

const editProfileRequest = (payload: ApiTypes.Profile.EditProfile) => ({
  type: Types.EDIT_PROFILE_REQUEST,
  payload,
})

const editProfileSuccess = (payload: boolean) => ({
  type: Types.EDIT_PROFILE_SUCCESS,
  payload
})

const editProfileFailed = (payload: string) => ({
  type: Types.EDIT_PROFILE_FAILED,
  payload,
})

const resetProfileErrorMessage = () => ({
  type: Types.RESET_PROFILE_ERROR_MESSAGE,
})

export default {
  getProfileRequest,
  getProfileSucces,
  getUploadLinkRequest,
  getUploadLinkSucces, 
  setAvatarRequest,
  setAvatarSuccess,
  editProfileRequest,
  editProfileFailed,
  editProfileSuccess,
  resetProfileErrorMessage,
}