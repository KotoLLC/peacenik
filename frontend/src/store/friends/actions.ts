
import { ApiTypes } from 'src/types'

export enum Types {
  GET_FRIENDS_REQUEST = 'GET_FRIENDS_REQUEST',
  GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS',
  
  GET_FRIENDS_OF_FRIENDS_REQUEST = 'GET_FRIENDS_OF_FRIENDS_REQUEST',
  GET_FRIENDS_OF_FRIENDS_SUCCESS = 'GET_FRIENDS_OF_FRIENDS_SUCCESS',
  
  ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST',
  ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS',

  GET_INVITATIONS_REQUEST = 'GET_INVITATIONS_REQUEST',
  GET_INVITATIONS_SUCCESS = 'GET_INVITATIONS_SUCCESS',
  
  INVITE_BY_EMAIL_REQUEST = 'INVITE_BY_EMAIL_REQUEST',
  INVITE_BY_EMAIL_SUCCESS = 'INVITE_BY_EMAIL_SUCCESS',
  
  ACCEPT_INVITATION_REQUEST = 'ACCEPT_INVITATION_REQUEST',
  REJECT_INVITATION_REQUEST = 'REJECT_INVITATION_REQUEST',
}

const getFriendsRequest = () => ({
  type: Types.GET_FRIENDS_REQUEST,
})

const getFriendsSucces = (payload: ApiTypes.Friends.Friend[]) => ({
  type: Types.GET_FRIENDS_SUCCESS,
  payload
})

const getFriendsOfFriendsRequest = () => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_REQUEST,
})

const getFriendsOfFriendsSucces = (payload: ApiTypes.User[]) => ({
  type: Types.GET_FRIENDS_OF_FRIENDS_SUCCESS,
  payload
})

const addFriendRequest = (payload: ApiTypes.Friends.Request) => ({
  type: Types.ADD_FRIEND_REQUEST,
  payload
})

const addFriendSuccess = () => ({
  type: Types.ADD_FRIEND_SUCCESS,
})

const getInvitationsRequest = () => ({
  type: Types.GET_INVITATIONS_REQUEST,
})

const getInvitationsSuccess = (payload: ApiTypes.Friends.Invitation[]) => ({
  type: Types.GET_INVITATIONS_SUCCESS,
  payload
})

const acceptInvitationRequest = (payload: ApiTypes.Friends.InvitationAccept) => ({
  type: Types.ACCEPT_INVITATION_REQUEST,
  payload
})

const rejectInvitationRequest = (payload: ApiTypes.Friends.InvitationReject) => ({
  type: Types.REJECT_INVITATION_REQUEST,
  payload
})

const inviteByEmailRequest = (payload: ApiTypes.Friends.Request) => ({
  type: Types.INVITE_BY_EMAIL_REQUEST,
  payload
})

const inviteByEmailSuccess = (payload: boolean) => ({
  type: Types.INVITE_BY_EMAIL_SUCCESS,
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
  rejectInvitationRequest,
  inviteByEmailRequest,
  inviteByEmailSuccess,
}