
import { ApiTypes } from './../../types'

export enum Types {
  GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS',
}

const getProfileRequest = () => ({
  type: Types.GET_PROFILE_REQUEST,
})

const getProfileSucces = (payload: ApiTypes.Profile) => ({
  type: Types.GET_PROFILE_SUCCESS,
  payload
})

export default {
  getProfileRequest,
  getProfileSucces,
}