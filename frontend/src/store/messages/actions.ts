
import { ApiTypes } from '../../types'

export enum Types {
  GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST',
  GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',

  GET_CURRENT_TOKEN_REQUEST = 'GET_CURRENT_TOKEN_REQUEST',
  GET_CURRENT_TOKEN_SUCCESS = 'GET_CURRENT_TOKEN_SUCCESS',

}

export const getMessagesRequest = () => ({
  type: Types.GET_MESSAGES_REQUEST,
})

export const getMessagesSucces = (payload: ApiTypes.Token[]) => ({
  type: Types.GET_MESSAGES_SUCCESS,
  payload
})

export const getCurrentTokenRequest = () => ({
  type: Types.GET_CURRENT_TOKEN_REQUEST,
})

export const getCurrentTokenSucces = (payload) => ({
  type: Types.GET_CURRENT_TOKEN_SUCCESS,
  payload
})

export default {
  getMessagesRequest,
  getMessagesSucces,
  getCurrentTokenRequest,
  getCurrentTokenSucces,
}