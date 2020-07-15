
import { ApiTypes, NodeTypes } from '../../types'

export enum Types {
  GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST',
  GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',

  GET_CURRENT_NODE_REQUEST = 'GET_CURRENT_NODE_REQUEST',
  GET_CURRENT_NODE_SUCCESS = 'GET_CURRENT_NODE_SUCCESS',

  GET_MESSAGES_FROM_NODE_REQUEST = 'GET_MESSAGES_FROM_NODE_REQUEST',
  GET_MESSAGES_FROM_NODE_SUCCESS = 'GET_MESSAGES_FROM_NODE_SUCCESS',

  POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST',
  POST_MESSAGE_SUCCESS = 'POST_MESSAGE_SUCCESS',
  
  DELETE_MESSAGE_REQUEST = 'DELETE_MESSAGE_REQUEST',
  DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS',
  
  EDIT_MESSAGE_REQUEST = 'EDIT_MESSAGE_REQUEST',
  EDIT_MESSAGE_SUCCESS = 'EDIT_MESSAGE_SUCCESS',
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

export const getMessagesFromNodeRequest = (payload: ApiTypes.Messages.MessagesFromNode) => ({
  type: Types.GET_MESSAGES_FROM_NODE_REQUEST,
  payload,
})

export const getMessagesFromNodeSucces = (payload: ApiTypes.Messages.Message[]) => ({
  type: Types.GET_MESSAGES_FROM_NODE_SUCCESS,
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

export const deleteMessageRequest = (payload: ApiTypes.Messages.DeleteMessage) => ({
  type: Types.DELETE_MESSAGE_REQUEST,
  payload
})

export const deleteMessageSucces = () => ({
  type: Types.DELETE_MESSAGE_SUCCESS,
})

export const editMessageRequest = (payload: ApiTypes.Messages.EditMessage) => ({
  type: Types.EDIT_MESSAGE_REQUEST,
  payload
})

export const editMessageSucces = () => ({
  type: Types.EDIT_MESSAGE_SUCCESS,
})

export default {
  getMessagesRequest,
  getMessagesSucces,
  getCurrentNodeRequest,
  getCurrentNodeSucces,
  postMessageRequest,
  postMessageSucces,
  getMessagesFromNodeRequest,
  getMessagesFromNodeSucces,
  deleteMessageRequest,
  deleteMessageSucces,
  editMessageRequest,
  editMessageSucces,
}