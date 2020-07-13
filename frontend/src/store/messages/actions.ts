
import { ApiTypes, NodeTypes } from '../../types'

export enum Types {
  GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST',
  GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',

  GET_CURRENT_NODE_REQUEST = 'GET_CURRENT_NODE_REQUEST',
  GET_CURRENT_NODE_SUCCESS = 'GET_CURRENT_NODE_SUCCESS',

  POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST',
  POST_MESSAGE_SUCCESS = 'POST_MESSAGE_SUCCESS',
}

export const getMessagesRequest = () => ({
  type: Types.GET_MESSAGES_REQUEST,
})

export const getMessagesSucces = (payload: NodeTypes.CurrentNode[]) => ({
  type: Types.GET_MESSAGES_SUCCESS,
  payload
})

export const getCurrentNodeRequest = () => ({
  type: Types.GET_CURRENT_NODE_REQUEST,
})

export const getCurrentNodeSucces = (payload: NodeTypes.CurrentNode) => ({
  type: Types.GET_CURRENT_NODE_SUCCESS,
  payload
})

export const postMessageRequest = (payload: ApiTypes.Messages.PostMessage) => ({
  type: Types.POST_MESSAGE_REQUEST,
  payload
})

export const postMessageSucces = (payload: boolean) => ({
  type: Types.POST_MESSAGE_SUCCESS,
  payload,
})

export default {
  getMessagesRequest,
  getMessagesSucces,
  getCurrentNodeRequest,
  getCurrentNodeSucces,
  postMessageRequest,
  postMessageSucces,
}