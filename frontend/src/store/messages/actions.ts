
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST',
  GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',

  GET_MORE_MESSAGES_REQUEST = 'GET_MORE_MESSAGES_REQUEST',
  GET_MORE_MESSAGES_SUCCESS = 'GET_MORE_MESSAGES_SUCCESS',
  GET_MORE_MESSAGES_FAILED = 'GET_MORE_MESSAGES_FAILED',

  GET_CURRENT_NODE_REQUEST = 'GET_CURRENT_NODE_REQUEST',
  GET_CURRENT_NODE_SUCCESS = 'GET_CURRENT_NODE_SUCCESS',

  GET_MESSAGES_FROM_NODE_REQUEST = 'GET_MESSAGES_FROM_NODE_REQUEST',
  GET_MESSAGES_FROM_NODE_SUCCESS = 'GET_MESSAGES_FROM_NODE_SUCCESS',
  GET_MESSAGES_FROM_NODE_FAILED = 'GET_MESSAGES_FROM_NODE_FAILED',
  
  GET_MORE_MESSAGES_FROM_NODE_REQUEST = 'GET_MORE_MESSAGES_FROM_NODE_REQUEST',
  GET_MORE_MESSAGES_FROM_NODE_SUCCESS = 'GET_MORE_MESSAGES_FROM_NODE_SUCCESS',
  GET_MORE_MESSAGES_FROM_NODE_FAILED = 'GET_MORE_MESSAGES_FROM_NODE_FAILED',

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

  GET_MESSAGE_UPLOAD_LINK_REQUEST = 'GET_MESSAGE_UPLOAD_LINK_REQUEST',
  GET_MESSAGE_UPLOAD_LINK_SUCCESS = 'GET_MESSAGE_UPLOAD_LINK_SUCCESS',

  SET_MESSAGE_ATTACHMENT_REQUEST = 'SET_MESSAGE_ATTACHMENT_REQUEST',
  SET_MESSAGE_ATTACHMENT_SUCCESS = 'SET_MESSAGE_ATTACHMENT_SUCCESS',

  LIKE_MESSAGE_REQUEST = 'LIKE_MESSAGE_REQUEST',
  LIKE_MESSAGE_SUCCESS = 'LIKE_MESSAGE_SUCCESS',
  
  LIKE_COMMENT_REQUEST = 'LIKE_COMMENT_REQUEST',
  LIKE_COMMENT_SUCCESS = 'LIKE_COMMENT_SUCCESS',
  
  GET_LIKES_FOR_MESSAGE_REQUEST = 'GET_LIKES_FOR_MESSAGE_REQUEST',
  GET_LIKES_FOR_MESSAGE_SUCCESS = 'GET_LIKES_FOR_MESSAGE_SUCCESS',
  
  GET_LIKES_FOR_COMMENT_REQUEST = 'GET_LIKES_FOR_COMMENT_REQUEST',
  GET_LIKES_FOR_COMMENT_SUCCESS = 'GET_LIKES_FOR_COMMENT_SUCCESS',
}

const getMessagesRequest = () => ({
  type: Types.GET_MESSAGES_REQUEST,
})

const getMessagesSucces = (payload: CommonTypes.NodeTypes.CurrentNode[]) => ({
  type: Types.GET_MESSAGES_SUCCESS,
  payload
})

const getCurrentNodeRequest = () => ({
  type: Types.GET_CURRENT_NODE_REQUEST,
})

const getCurrentNodeSucces = (payload: CommonTypes.NodeTypes.CurrentNode) => ({
  type: Types.GET_CURRENT_NODE_SUCCESS,
  payload
})

const getMessagesFromNodeRequest = (payload: ApiTypes.Messages.MessagesFromNode) => ({
  type: Types.GET_MESSAGES_FROM_NODE_REQUEST,
  payload,
})

const getMessagesFromNodeSucces = (payload: {
  node: string
  messages: ApiTypes.Messages.Message[]
}) => ({
  type: Types.GET_MESSAGES_FROM_NODE_SUCCESS,
  payload
})

const getMessagesFromNodeFailed = () => ({
  type: Types.GET_MESSAGES_FROM_NODE_FAILED
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

const getMessageUploadLinkRequest = (payload: ApiTypes.Messages.UploadLinkRequest) => ({
  type: Types.GET_MESSAGE_UPLOAD_LINK_REQUEST,
  payload,
})

const getMessageUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
  type: Types.GET_MESSAGE_UPLOAD_LINK_SUCCESS,
  payload
})

const setAttachmentRequest = (payload: ApiTypes.Messages.Attachment) => ({
  type: Types.SET_MESSAGE_ATTACHMENT_REQUEST,
  payload,
})

const setAttachmentSuccess = () => ({
  type: Types.SET_MESSAGE_ATTACHMENT_SUCCESS,
})

const linkMessageRequest = (payload: ApiTypes.Messages.Like) => ({
  type: Types.LIKE_MESSAGE_REQUEST,
  payload,
})

const linkMessageSuccess = () => ({
  type: Types.LIKE_MESSAGE_SUCCESS,
})

const linkCommnetRequest = (payload: ApiTypes.Messages.Like) => ({
  type: Types.LIKE_COMMENT_REQUEST,
  payload,
})

const linkCommentSuccess = () => ({
  type: Types.LIKE_COMMENT_SUCCESS,
})

const getLikesForMessageRequest = (payload: ApiTypes.Messages.Like) => ({
  type: Types.GET_LIKES_FOR_MESSAGE_REQUEST,
  payload,
})

const getLikesForMessageSuccess = (payload: ApiTypes.Messages.LikesInfoData) => ({
  type: Types.GET_LIKES_FOR_MESSAGE_SUCCESS,
  payload,
})

const getLikesForCommentRequest = (payload: ApiTypes.Messages.Like) => ({
  type: Types.GET_LIKES_FOR_COMMENT_REQUEST,
  payload,
})

const getLikesForCommentSuccess = (payload: ApiTypes.Messages.LikesInfoData) => ({
  type: Types.GET_LIKES_FOR_COMMENT_SUCCESS,
  payload,
})

const getMoreMessagesRequest = () => ({
  type: Types.GET_MORE_MESSAGES_REQUEST,
})

const getMoreMessagesSucces = (payload: CommonTypes.NodeTypes.CurrentNode[]) => ({
  type: Types.GET_MORE_MESSAGES_SUCCESS,
  payload
})

const getMoreMessagesFailed = () => ({
  type: Types.GET_MORE_MESSAGES_FAILED,
})

const getMoreMessagesFromNodeRequest = (payload: ApiTypes.Messages.MessagesFromNode) => ({
  type: Types.GET_MORE_MESSAGES_FROM_NODE_REQUEST,
  payload,
})

const getMoreMessagesFromNodeSucces = (payload: {
  node: string
  messages: ApiTypes.Messages.Message[]
}) => ({
  type: Types.GET_MORE_MESSAGES_FROM_NODE_SUCCESS,
  payload
})

const getMoreMessagesFromNodeFalied = () => ({
  type: Types.GET_MORE_MESSAGES_FROM_NODE_FAILED,
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
  getMessagesFromNodeFailed,
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
  getMessageUploadLinkRequest,
  getMessageUploadLinkSucces,
  setAttachmentRequest,
  setAttachmentSuccess,
  linkMessageRequest,
  linkMessageSuccess,
  linkCommnetRequest,
  linkCommentSuccess,
  getLikesForMessageRequest,
  getLikesForMessageSuccess,
  getLikesForCommentRequest,
  getLikesForCommentSuccess,
  getMoreMessagesRequest,
  getMoreMessagesSucces,
  getMoreMessagesFailed,
  getMoreMessagesFromNodeRequest,
  getMoreMessagesFromNodeSucces,
  getMoreMessagesFromNodeFalied,
}