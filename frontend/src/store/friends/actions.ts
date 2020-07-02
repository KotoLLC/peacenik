
import { ApiTypes } from '../../types'

export enum Types {
  GET_FRIENDS_REQUEST = 'GET_FRIENDS_REQUEST',
  GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS',
  
  GET_FRIENDS_OF_FRIENDS_REQUEST = 'GET_FRIENDS_OF_FRIENDS_REQUEST',
  GET_FRIENDS_OF_FRIENDS_SUCCESS = 'GET_FRIENDS_OF_FRIENDS_SUCCESS',
  
  ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST',
  ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS',
}

export const getFriendsRequest = () => ({
  type: Types.GET_FRIENDS_REQUEST,
})

export const getFriendsSucces = (data: ApiTypes.User[]) => ({
  type: Types.GET_FRIENDS_SUCCESS,
  payload: data
})

export const getFriendsOfFriendsRequest = () => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_REQUEST,
})

export const getFriendsOfFriendsSucces = (data: ApiTypes.User[]) => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_SUCCESS,
  payload: data
})

export const addFriendRequest = (payload: ApiTypes.FriendRequest) => ({
  type: Types.ADD_FRIEND_REQUEST,
  payload
})

export const addFriendSuccess = () => ({
  type: Types.ADD_FRIEND_SUCCESS,
})

export default {
  getFriendsRequest,
  getFriendsSucces,
  getFriendsOfFriendsRequest,
  getFriendsOfFriendsSucces,
  addFriendRequest,
  addFriendSuccess,
}