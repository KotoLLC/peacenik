import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  ADD_FRIEND_TO_ROOM                      = 'ADD_FRIEND_TO_ROOM',
  GET_LAST_MESSAGE_TOKENS_REQUEST         = 'GET_MESSAGE_TOKENS_REQUEST',
  GET_MESSAGE_TOKENS_SUCCESS              = 'GET_MESSAGE_TOKENS_SUCCESS',

  GET_MORE_MESSAGE_REQUEST                = 'GET_MORE_MESSAGE_REQUEST',
  GET_MORE_MESSAGE_SUCCESS                = 'GET_MORE_MESSAGE_SUCCESS',
  GET_MORE_MESSAGE_FAILED                 = 'GET_MORE_MESSAGE_FAILED',

  GET_MESSAGE_TOKENS_FROM_HUB_REQUEST     = 'GET_MESSAGE_TOKENS_FROM_HUB_REQUEST',
  GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS = 'GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS',
  GET_MESSAGE_TOKENS_FROM_HUB_FAILED      = 'GET_MESSAGE_TOKENS_FROM_HUB_FAILED',
}

const addFriendToRoom = (payload: string) => ({
  type: Types.ADD_FRIEND_TO_ROOM,
  payload
})

const getMessageTokensRequest = () => ({
  type: Types.GET_LAST_MESSAGE_TOKENS_REQUEST,
})

const getMessageTokensSuccess = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
  type: Types.GET_MESSAGE_TOKENS_SUCCESS,
  payload
})

const getUserLastMessageFromHubSuccess = (payload: {
  hub: string
  usersLastMessage: ApiTypes.Messages.UserMessage[]
}) => ({
  type: Types.GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS,
  payload
})

const getMessageFromHubFailed = () => ({
  type: Types.GET_MESSAGE_TOKENS_FROM_HUB_FAILED
})

const getMoreMessageRequest = () => ({
  type: Types.GET_MORE_MESSAGE_REQUEST,
})

const getMoreMessageSucces = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
  type: Types.GET_MORE_MESSAGE_SUCCESS,
  payload
})

const getMoreMessageFailed = () => ({
  type: Types.GET_MORE_MESSAGE_FAILED,
})

export default {
  addFriendToRoom,
  getMessageTokensRequest,
  getMessageTokensSuccess, 
  getUserLastMessageFromHubSuccess,
  getMessageFromHubFailed,
}
