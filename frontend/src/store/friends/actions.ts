
import { ApiTypes } from '../../types'

export enum Types {
  GET_FRIENDS_REQUEST = 'GET_FRIENDS_REQUEST',
  GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS',
  GET_FRIENDS_FAILED = 'GET_FRIENDS_FAILED',
}

export const getFriendsRequest = () => ({
  type: Types.GET_FRIENDS_REQUEST,
})

export const getFriendsSucces = (data: ApiTypes.Friend[]) => ({
  type: Types.GET_FRIENDS_SUCCESS,
  payload: data
})

export const getFriendsFailed = (payload: string) => ({
  type: Types.GET_FRIENDS_FAILED,
  payload
})

export default {
  getFriendsRequest,
  getFriendsSucces,
  getFriendsFailed,
}