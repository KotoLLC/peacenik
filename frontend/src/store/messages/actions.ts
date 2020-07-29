
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

  POST_COMMENT_REQUEST = 'POST_COMMENT_REQUEST',
  POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS',
  
  EDIT_COMMENT_REQUEST = 'EDIT_COMMENT_REQUEST',
  EDIT_COMMENT_SUCCESS = 'EDIT_COMMENT_SUCCESS',
  
  DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST',
  DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS',
}

const getMessagesRequest = () => ({
  type: Types.GET_MESSAGES_REQUEST,
})

const getMessagesSucces = (payload: NodeTypes.CurrentNode[]) => ({
  type: Types.GET_MESSAGES_SUCCESS,
  payload
})

const getCurrentNodeRequest = () => ({
  type: Types.GET_CURRENT_NODE_REQUEST,
})

const getCurrentNodeSucces = (payload: NodeTypes.CurrentNode) => ({
  type: Types.GET_CURRENT_NODE_SUCCESS,
  payload
})

const getMessagesFromNodeRequest = (payload: ApiTypes.Messages.MessagesFromNode) => ({
  type: Types.GET_MESSAGES_FROM_NODE_REQUEST,
  payload,
})

const getMessagesFromNodeSucces = (payload: ApiTypes.Messages.Message[]) => ({
  type: Types.GET_MESSAGES_FROM_NODE_SUCCESS,
  payload
})

const postMessageRequest = (payload: ApiTypes.Messages.PostMessage) => ({
  type: Types.POST_MESSAGE_REQUEST,
  payload
})

const postMessageSucces = (payload: boolean) => ({
  type: Types.POST_MESSAGE_SUCCESS,
  payload,
})

const deleteMessageRequest = (payload: ApiTypes.Messages.DeleteMessage) => ({
  type: Types.DELETE_MESSAGE_REQUEST,
  payload
})

const deleteMessageSucces = () => ({
  type: Types.DELETE_MESSAGE_SUCCESS,
})

const editMessageRequest = (payload: ApiTypes.Messages.EditMessage) => ({
  type: Types.EDIT_MESSAGE_REQUEST,
  payload
})

const editMessageSucces = () => ({
  type: Types.EDIT_MESSAGE_SUCCESS,
})

const postCommentRequest = (payload: ApiTypes.Messages.PostComment) => ({
  type: Types.POST_COMMENT_REQUEST,
  payload
})

const postCommentSucces = (payload: boolean) => ({
  type: Types.POST_COMMENT_SUCCESS,
  payload,
})

const editCommentRequest = (payload: ApiTypes.Messages.EditComment) => ({
  type: Types.EDIT_COMMENT_REQUEST,
  payload
})

const editCommentSucces = () => ({
  type: Types.EDIT_COMMENT_SUCCESS,
})

const deleteCommentRequest = (payload: ApiTypes.Messages.DeleteComment) => ({
  type: Types.DELETE_COMMENT_REQUEST,
  payload
})

const deleteCommentSucces = () => ({
  type: Types.DELETE_COMMENT_SUCCESS,
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
  postCommentRequest,
  postCommentSucces,
  editCommentRequest,
  editCommentSucces,
  deleteCommentRequest,
  deleteCommentSucces,
}