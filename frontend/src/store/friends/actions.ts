
import { ApiTypes } from '../../types'

export enum Types {
  GET_FRIENDS_REQUEST = 'GET_FRIENDS_REQUEST',
  GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS',
  
  GET_FRIENDS_OF_FRIENDS_REQUEST = 'GET_FRIENDS_OF_FRIENDS_REQUEST',
  GET_FRIENDS_OF_FRIENDS_SUCCESS = 'GET_FRIENDS_OF_FRIENDS_SUCCESS',
  
  ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST',
  ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS',

  GET_INVITATIONS_REQUEST = 'GET_INVITATIONS_REQUEST',
  GET_INVITATIONS_SUCCESS = 'GET_INVITATIONS_SUCCESS',
  
  ACCEPT_INVITATION_REQUEST = 'ACCEPT_INVITATION_REQUEST',
}

export const getFriendsRequest = () => ({
  type: Types.GET_FRIENDS_REQUEST,
})

export const getFriendsSucces = (payload: ApiTypes.User[]) => ({
  type: Types.GET_FRIENDS_SUCCESS,
  payload
})

export const getFriendsOfFriendsRequest = () => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_REQUEST,
})

export const getFriendsOfFriendsSucces = (payload: ApiTypes.User[]) => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_SUCCESS,
  payload
})

export const addFriendRequest = (payload: ApiTypes.FriendRequest) => ({
  type: Types.ADD_FRIEND_REQUEST,
  payload
})

export const addFriendSuccess = () => ({
  type: Types.ADD_FRIEND_SUCCESS,
})

export const getInvitationsRequest = () => ({
  type: Types.GET_INVITATIONS_REQUEST,
})

export const getInvitationsSuccess = (payload: ApiTypes.Invitation[]) => ({
  type: Types.GET_INVITATIONS_SUCCESS,
  payload
})

export const acceptInvitationRequest = (payload: ApiTypes.AcceptInvitation) => ({
  type: Types.ACCEPT_INVITATION_REQUEST,
  payload
})


export default {
  getFriendsRequest,
  getFriendsSucces,
  getFriendsOfFriendsRequest,
  getFriendsOfFriendsSucces,
  addFriendRequest,
  addFriendSuccess,
  getInvitationsRequest,
  getInvitationsSuccess,
  acceptInvitationRequest,
}