
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
//   GET_ACTION_TOKENS_REQUEST = 'GET_ACTION_TOKENS_REQUEST',
//   GET_ACTION_TOKENS_SUCCESS = 'GET_ACTION_TOKENS_SUCCESS',

//   GET_MORE_ACTION_REQUEST = 'GET_MORE_ACTION_REQUEST',
//   GET_MORE_ACTION_SUCCESS = 'GET_MORE_ACTION_SUCCESS',
//   GET_MORE_ACTION_FAILED = 'GET_MORE_ACTION_FAILED',

//   GET_CURRENT_HUB_REQUEST = 'GET_CURRENT_HUB_REQUEST',
//   GET_CURRENT_HUB_SUCCESS = 'GET_CURRENT_HUB_SUCCESS',
//   GET_CURRENT_HUB_FAILED = 'GET_CURRENT_HUB_FAILED',

//   GET_ACTION_TOKENS_FROM_HUB_REQUEST = 'GET_ACTION_TOKENS_FROM_HUB_REQUEST',
//   GET_ACTION_TOKENS_FROM_HUB_SUCCESS = 'GET_ACTION_TOKENS_FROM_HUB_SUCCESS',
//   GET_ACTION_TOKENS_FROM_HUB_FAILED = 'GET_ACTION_TOKENS_FROM_HUB_FAILED',
  
//   GET_MORE_ACTION_FROM_HUB_REQUEST = 'GET_MORE_ACTION_FROM_HUB_REQUEST',
//   GET_MORE_ACTION_FROM_HUB_SUCCESS = 'GET_MORE_ACTION_FROM_HUB_SUCCESS',
//   GET_MORE_ACTION_FROM_HUB_FAILED = 'GET_MORE_ACTION_FROM_HUB_FAILED',
  
//   GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST = 'GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST',
//   GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS = 'GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS',
//   GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED = 'GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED',

//   RESET_ACTION_MESSAGES_BY_ID = 'RESET_ACTION_MESSAGES_BY_ID',
  
//   CLEAN_ALL_ACTION = 'CLEAN_ALL_ACTION',

//   POST_ACTION_MESSAGE_REQUEST = 'POST_ACTION_MESSAGE_REQUEST',
//   POST_ACTION_MESSAGE_SUCCESS = 'POST_ACTION_MESSAGE_SUCCESS',

//   DELETE_ACTION_MESSAGES_REQUEST = 'DELETE_ACTION_MESSAGES_REQUEST',
//   DELETE_ACTION_MESSAGES_SUCCESS = 'DELETE_ACTION_MESSAGES_SUCCESS',
  
//   REPORT_ACTION_MESSAGES_HUB_REQUEST = 'REPORT_ACTION_MESSAGES_HUB_REQUEST',
//   REPORT_ACTION_MESSAGES_CENTRAL_REQUEST = 'REPORT_ACTION_MESSAGES_CENTRAL_REQUEST',
//   REPORT_ACTION_MESSAGES_SUCCESS = 'REPORT_ACTION_MESSAGES_SUCCESS',

//   EDIT_ACTION_MESSAGES_REQUEST = 'EDIT_ACTION_MESSAGES_REQUEST',
//   EDIT_ACTION_MESSAGES_SUCCESS = 'EDIT_ACTION_MESSAGES_SUCCESS',

//   POST_ACTION_COMMENT_REQUEST = 'POST_ACTION_COMMENT_REQUEST',
//   POST_ACTION_COMMENT_SUCCESS = 'POST_ACTION_COMMENT_SUCCESS',

//   EDIT_ACTION_COMMENT_REQUEST = 'EDIT_ACTION_COMMENT_REQUEST',
//   EDIT_ACTION_COMMENT_SUCCESS = 'EDIT_ACTION_COMMENT_SUCCESS',

//   DELETE_ACTION_COMMENT_REQUEST = 'DELETE_ACTION_COMMENT_REQUEST',
//   DELETE_ACTION_COMMENT_SUCCESS = 'DELETE_ACTION_COMMENT_SUCCESS',

//   GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST = 'GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST',
//   GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS = 'GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS',

//   SET_ACTION_MESSAGES_ATTACHMENT_REQUEST = 'SET_ACTION_MESSAGES_ATTACHMENT_REQUEST',
//   SET_ACTION_MESSAGES_ATTACHMENT_SUCCESS = 'SET_ACTION_MESSAGES_ATTACHMENT_SUCCESS',

//   LIKE_ACTION_MESSAGES_REQUEST = 'LIKE_ACTION_MESSAGES_REQUEST',
//   LIKE_ACTION_MESSAGES_SUCCESS = 'LIKE_ACTION_MESSAGES_SUCCESS',
  
//   LIKE_ACTION_COMMENT_REQUEST = 'LIKE_ACTION_COMMENT_REQUEST',
//   LIKE_ACTION_COMMENT_SUCCESS = 'LIKE_ACTION_COMMENT_SUCCESS',
  
//   GET_LIKES_FOR_ACTION_MESSAGES_REQUEST = 'GET_LIKES_FOR_ACTION_MESSAGES_REQUEST',
//   GET_LIKES_FOR_ACTION_MESSAGES_SUCCESS = 'GET_LIKES_FOR_ACTION_MESSAGES_SUCCESS',
  
//   GET_LIKES_FOR_ACTION_COMMENT_REQUEST = 'GET_LIKES_FOR_ACTION_COMMENT_REQUEST',
//   GET_LIKES_FOR_ACTION_COMMENT_SUCCESS = 'GET_LIKES_FOR_ACTION_COMMENT_SUCCESS',

//   HIDE_ACTION_MESSAGES_REQUEST = 'HIDE_ACTION_MESSAGES_REQUEST',
//   HIDE_ACTION_MESSAGES_SUCCESS = 'HIDE_ACTION_MESSAGES_SUCCESS',

//   HIDE_ACTION_COMMENT_REQUEST = 'HIDE_ACTION_COMMENT_REQUEST',
//   HIDE_ACTION_COMMENT_SUCCESS = 'HIDE_ACTION_COMMENT_SUCCESS',
}

// const getMessageTokensRequest = () => ({
//   type: Types.GET_ACTION_TOKENS_REQUEST,
// })

// const getMessageTokensSuccess = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
//   type: Types.GET_ACTION_TOKENS_SUCCESS,
//   payload
// })

// const getCurrentHubRequest = () => ({
//   type: Types.GET_CURRENT_HUB_REQUEST,
// })

// const getCurrentHubSuccess = (payload: CommonTypes.HubTypes.CurrentHub) => ({
//   type: Types.GET_CURRENT_HUB_SUCCESS,
//   payload
// })

// const getCurrentHubFailed = () => ({
//   type: Types.GET_CURRENT_HUB_FAILED,
// })

// const getMessageFromHubRequest = (payload: ApiTypes.Message.MessagesFromHub) => ({
//   type: Types.GET_ACTION_TOKENS_FROM_HUB_REQUEST,
//   payload,
// })

// const getMessageFromHubSuccess = (payload: {
//   hub: string
//   messages: ApiTypes.Message.Message[]
// }) => ({
//   type: Types.GET_ACTION_TOKENS_FROM_HUB_SUCCESS,
//   payload
// })

// const getMessageFromHubFailed = () => ({
//   type: Types.GET_ACTION_TOKENS_FROM_HUB_FAILED
// })

// const postMessageMessageRequest = (payload: ApiTypes.Message.PostMessage) => ({
//   type: Types.POST_ACTION_MESSAGE_REQUEST,
//   payload
// })

// const postMessageMessageSucces = (payload: boolean) => ({
//   type: Types.POST_ACTION_MESSAGE_SUCCESS,
//   payload,
// })

// const deleteMessageMessageRequest = (payload: ApiTypes.Message.DeleteMessage) => ({
//   type: Types.DELETE_ACTION_MESSAGES_REQUEST,
//   payload
// })

// const deleteMessageMessageSucces = () => ({
//   type: Types.DELETE_ACTION_MESSAGES_SUCCESS,
// })

// const reportMessageMessageHubRequest = (payload: ApiTypes.Message.ReportMessageHub) => ({
//   type: Types.REPORT_ACTION_MESSAGES_HUB_REQUEST,
//   payload
// })

// const reportMessageMessageCentralRequest = (payload: ApiTypes.Message.ReportMessageCentral) => ({
//   type: Types.REPORT_ACTION_MESSAGES_CENTRAL_REQUEST,
//   payload
// })

// const reportMessageMessageSucces = () => ({
//   type: Types.REPORT_ACTION_MESSAGES_SUCCESS,
// })

// const editMessageMessageRequest = (payload: ApiTypes.Message.EditMessage) => ({
//   type: Types.EDIT_ACTION_MESSAGES_REQUEST,
//   payload
// })

// const editMessageMessageSucces = () => ({
//   type: Types.EDIT_ACTION_MESSAGES_SUCCESS,
// })

// const postMessageCommentRequest = (payload: ApiTypes.Message.PostComment) => ({
//   type: Types.POST_ACTION_COMMENT_REQUEST,
//   payload
// })

// const postMessageCommentSucces = (payload: boolean) => ({
//   type: Types.POST_ACTION_COMMENT_SUCCESS,
//   payload,
// })

// const editMessageCommentRequest = (payload: ApiTypes.Message.EditComment) => ({
//   type: Types.EDIT_ACTION_COMMENT_REQUEST,
//   payload
// })

// const editMessageCommentSucces = () => ({
//   type: Types.EDIT_ACTION_COMMENT_SUCCESS,
// })

// const deleteCommentRequest = (payload: ApiTypes.Message.DeleteComment) => ({
//   type: Types.DELETE_ACTION_COMMENT_REQUEST,
//   payload
// })

// const deleteMessageCommentSucces = () => ({
//   type: Types.DELETE_ACTION_COMMENT_SUCCESS,
// })

// const getMessageMessageUploadLinkRequest = (payload: ApiTypes.Message.UploadLinkRequest) => ({
//   type: Types.GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST,
//   payload,
// })

// const getMessageMessageUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
//   type: Types.GET_ACTION_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS,
//   payload
// })

// const setAttachmentRequest = (payload: ApiTypes.Message.Attachment) => ({
//   type: Types.SET_ACTION_MESSAGES_ATTACHMENT_REQUEST,
//   payload,
// })

// const setAttachmentSuccess = () => ({
//   type: Types.SET_ACTION_MESSAGES_ATTACHMENT_SUCCESS,
// })

// const linkMessageMessageRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.LIKE_ACTION_MESSAGES_REQUEST,
//   payload,
// }) 

// const linkMessageMessageSuccess = () => ({
//   type: Types.LIKE_ACTION_MESSAGES_SUCCESS,
// })

// const hideMessageMessageRequest = (payload: ApiTypes.Message.Hide) => ({
//   type: Types.HIDE_ACTION_MESSAGES_REQUEST,
//   payload,
// })

// const hideMessageMessageSuccess = () => ({
//   type: Types.HIDE_ACTION_MESSAGES_SUCCESS,
// })

// const hideMessageCommentRequest = (payload: ApiTypes.Message.Hide) => ({
//   type: Types.HIDE_ACTION_COMMENT_REQUEST,
//   payload,
// })

// const hideMessageCommentSuccess = () => ({
//   type: Types.HIDE_ACTION_COMMENT_SUCCESS,
// })

// const linkMessageCommnetRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.LIKE_ACTION_COMMENT_REQUEST,
//   payload,
// })

// const linkMessageCommentSuccess = () => ({
//   type: Types.LIKE_ACTION_COMMENT_SUCCESS,
// })

// const getLikesForMessageMessageRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.GET_LIKES_FOR_ACTION_MESSAGES_REQUEST,
//   payload,
// })

// const getLikesForMessageMessageSuccess = (payload: ApiTypes.Message.LikesInfoData) => ({
//   type: Types.GET_LIKES_FOR_ACTION_MESSAGES_SUCCESS,
//   payload,
// })

// const getLikesForMessageCommentRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.GET_LIKES_FOR_ACTION_COMMENT_REQUEST,
//   payload,
// })

// const getLikesForMessageCommentSuccess = (payload: ApiTypes.Message.LikesInfoData) => ({
//   type: Types.GET_LIKES_FOR_ACTION_COMMENT_SUCCESS,
//   payload,
// })

// const getMoreMessageRequest = () => ({
//   type: Types.GET_MORE_ACTION_REQUEST,
// })

// const getMoreMessageSucces = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
//   type: Types.GET_MORE_ACTION_SUCCESS,
//   payload
// })

// const getMoreMessageFailed = () => ({
//   type: Types.GET_MORE_ACTION_FAILED,
// })

// const getMoreMessageFromHubRequest = (payload: ApiTypes.Message.MessagesFromHub) => ({
//   type: Types.GET_MORE_ACTION_FROM_HUB_REQUEST,
//   payload,
// })

// const getMoreMessageFromHubSuccess = (payload: {
//   hub: string
//   messages: ApiTypes.Message.Message[]
// }) => ({
//   type: Types.GET_MORE_ACTION_FROM_HUB_SUCCESS,
//   payload
// })

// const getMoreMessageFromHubFailed = () => ({
//   type: Types.GET_MORE_ACTION_FROM_HUB_FAILED,
// })

// const getMessageMessagesByIdFromHubRequest = (payload: ApiTypes.Message.MessagesById) => ({
//   type: Types.GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST,
//   payload,
// })

// const getMessageMessagesByIdFromHubSuccess = (payload: {
//   hub: string
//   messages: ApiTypes.Message.Message
// }) => ({
//   type: Types.GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS,
//   payload
// })

// const getMessageMessagesByIdFromHubFailed = () => ({
//   type: Types.GET_ACTION_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED,
// })

// const resetMessageMessageById = () => ({
//   type: Types.RESET_ACTION_MESSAGES_BY_ID,
// })

// const cleanAllMessages = () => ({
//   type: Types.CLEAN_ALL_ACTION,
// })

export default {
//   getMessageTokensRequest,
//   getMessageTokensSuccess,
//   getCurrentHubRequest,
//   getCurrentHubSuccess,
//   getCurrentHubFailed,
//   postMessageMessageRequest,
//   postMessageMessageSucces,
//   getMessageFromHubRequest,
//   getMessageFromHubSuccess,
//   getMessageFromHubFailed,
//   deleteMessageMessageRequest,
//   deleteMessageMessageSucces,
//   editMessageMessageRequest,
//   editMessageMessageSucces,
//   postMessageCommentRequest,
//   postMessageCommentSucces,
//   editMessageCommentRequest,
//   editMessageCommentSucces,
//   deleteCommentRequest,
//   deleteMessageCommentSucces,
//   getMessageMessageUploadLinkRequest,
//   getMessageMessageUploadLinkSucces,
//   setAttachmentRequest,
//   setAttachmentSuccess,
//   linkMessageMessageRequest,
//   linkMessageMessageSuccess,
//   linkMessageCommnetRequest,
//   linkMessageCommentSuccess,
//   getLikesForMessageMessageRequest,
//   getLikesForMessageMessageSuccess,
//   getLikesForMessageCommentRequest,
//   getLikesForMessageCommentSuccess,
//   getMoreMessageRequest,
//   getMoreMessageSucces,
//   getMoreMessageFailed,
//   getMoreMessageFromHubRequest,
//   getMoreMessageFromHubSuccess,
//   getMoreMessageFromHubFailed,
//   getMessageMessagesByIdFromHubRequest,
//   getMessageMessagesByIdFromHubSuccess,
//   resetMessageMessageById,
//   getMessageMessagesByIdFromHubFailed,
//   hideMessageMessageRequest,
//   hideMessageMessageSuccess,
//   hideMessageCommentRequest,
//   hideMessageCommentSuccess,
//   reportMessageMessageHubRequest,
//   reportMessageMessageCentralRequest,
//   reportMessageMessageSucces,
//   cleanAllMessages,
}