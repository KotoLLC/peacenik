
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  GET_MESSAGE_TOKENS_REQUEST = 'GET_MESSAGE_TOKENS_REQUEST',
  GET_MESSAGE_TOKENS_SUCCESS = 'GET_MESSAGE_TOKENS_SUCCESS',

  GET_MORE_MESSAGE_REQUEST = 'GET_MORE_MESSAGE_REQUEST',
  GET_MORE_MESSAGE_SUCCESS = 'GET_MORE_MESSAGE_SUCCESS',
  GET_MORE_MESSAGE_FAILED = 'GET_MORE_MESSAGE_FAILED',

//   GET_CURRENT_HUB_REQUEST = 'GET_CURRENT_HUB_REQUEST',
//   GET_CURRENT_HUB_SUCCESS = 'GET_CURRENT_HUB_SUCCESS',
//   GET_CURRENT_HUB_FAILED = 'GET_CURRENT_HUB_FAILED',

  GET_MESSAGE_TOKENS_FROM_HUB_REQUEST = 'GET_MESSAGE_TOKENS_FROM_HUB_REQUEST',
  GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS = 'GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS',
  GET_MESSAGE_TOKENS_FROM_HUB_FAILED = 'GET_MESSAGE_TOKENS_FROM_HUB_FAILED',
  
//   GET_MORE_MESSAGE_FROM_HUB_REQUEST = 'GET_MORE_MESSAGE_FROM_HUB_REQUEST',
//   GET_MORE_MESSAGE_FROM_HUB_SUCCESS = 'GET_MORE_MESSAGE_FROM_HUB_SUCCESS',
//   GET_MORE_MESSAGE_FROM_HUB_FAILED = 'GET_MORE_MESSAGE_FROM_HUB_FAILED',
  
//   GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST = 'GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST',
//   GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS = 'GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS',
//   GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED = 'GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED',

//   RESET_MESSAGE_MESSAGES_BY_ID = 'RESET_MESSAGE_MESSAGES_BY_ID',
  
//   CLEAN_ALL_ACTION = 'CLEAN_ALL_ACTION',

//   POST_MESSAGE_MESSAGE_REQUEST = 'POST_MESSAGE_MESSAGE_REQUEST',
//   POST_MESSAGE_MESSAGE_SUCCESS = 'POST_MESSAGE_MESSAGE_SUCCESS',

//   DELETE_MESSAGE_MESSAGES_REQUEST = 'DELETE_MESSAGE_MESSAGES_REQUEST',
//   DELETE_MESSAGE_MESSAGES_SUCCESS = 'DELETE_MESSAGE_MESSAGES_SUCCESS',
  
//   REPORT_MESSAGE_MESSAGES_HUB_REQUEST = 'REPORT_MESSAGE_MESSAGES_HUB_REQUEST',
//   REPORT_MESSAGE_MESSAGES_CENTRAL_REQUEST = 'REPORT_MESSAGE_MESSAGES_CENTRAL_REQUEST',
//   REPORT_MESSAGE_MESSAGES_SUCCESS = 'REPORT_MESSAGE_MESSAGES_SUCCESS',

//   EDIT_MESSAGE_MESSAGES_REQUEST = 'EDIT_MESSAGE_MESSAGES_REQUEST',
//   EDIT_MESSAGE_MESSAGES_SUCCESS = 'EDIT_MESSAGE_MESSAGES_SUCCESS',

//   POST_MESSAGE_COMMENT_REQUEST = 'POST_MESSAGE_COMMENT_REQUEST',
//   POST_MESSAGE_COMMENT_SUCCESS = 'POST_MESSAGE_COMMENT_SUCCESS',

//   EDIT_MESSAGE_COMMENT_REQUEST = 'EDIT_MESSAGE_COMMENT_REQUEST',
//   EDIT_MESSAGE_COMMENT_SUCCESS = 'EDIT_MESSAGE_COMMENT_SUCCESS',

//   DELETE_MESSAGE_COMMENT_REQUEST = 'DELETE_MESSAGE_COMMENT_REQUEST',
//   DELETE_MESSAGE_COMMENT_SUCCESS = 'DELETE_MESSAGE_COMMENT_SUCCESS',

//   GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST = 'GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST',
//   GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS = 'GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS',

//   SET_MESSAGE_MESSAGES_ATTACHMENT_REQUEST = 'SET_MESSAGE_MESSAGES_ATTACHMENT_REQUEST',
//   SET_MESSAGE_MESSAGES_ATTACHMENT_SUCCESS = 'SET_MESSAGE_MESSAGES_ATTACHMENT_SUCCESS',

//   LIKE_MESSAGE_MESSAGES_REQUEST = 'LIKE_MESSAGE_MESSAGES_REQUEST',
//   LIKE_MESSAGE_MESSAGES_SUCCESS = 'LIKE_MESSAGE_MESSAGES_SUCCESS',
  
//   LIKE_MESSAGE_COMMENT_REQUEST = 'LIKE_MESSAGE_COMMENT_REQUEST',
//   LIKE_MESSAGE_COMMENT_SUCCESS = 'LIKE_MESSAGE_COMMENT_SUCCESS',
  
//   GET_LIKES_FOR_MESSAGE_MESSAGES_REQUEST = 'GET_LIKES_FOR_MESSAGE_MESSAGES_REQUEST',
//   GET_LIKES_FOR_MESSAGE_MESSAGES_SUCCESS = 'GET_LIKES_FOR_MESSAGE_MESSAGES_SUCCESS',
  
//   GET_LIKES_FOR_MESSAGE_COMMENT_REQUEST = 'GET_LIKES_FOR_MESSAGE_COMMENT_REQUEST',
//   GET_LIKES_FOR_MESSAGE_COMMENT_SUCCESS = 'GET_LIKES_FOR_MESSAGE_COMMENT_SUCCESS',

//   HIDE_MESSAGE_MESSAGES_REQUEST = 'HIDE_MESSAGE_MESSAGES_REQUEST',
//   HIDE_MESSAGE_MESSAGES_SUCCESS = 'HIDE_MESSAGE_MESSAGES_SUCCESS',

//   HIDE_MESSAGE_COMMENT_REQUEST = 'HIDE_MESSAGE_COMMENT_REQUEST',
//   HIDE_MESSAGE_COMMENT_SUCCESS = 'HIDE_MESSAGE_COMMENT_SUCCESS',
}

const getMessageTokensRequest = () => ({
  type: Types.GET_MESSAGE_TOKENS_REQUEST,
})

const getMessageTokensSuccess = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
  type: Types.GET_MESSAGE_TOKENS_SUCCESS,
  payload
})



const getMessageFromHubRequest = (payload: ApiTypes.Feed.MessagesFromHub) => ({
  type: Types.GET_MESSAGE_TOKENS_FROM_HUB_REQUEST,
  payload,
})

const getUserLastMessageFromHubSuccess = (payload: {
  hub: string
  usesMessage: ApiTypes.Messages.UserMessage[]
}) => ({
  type: Types.GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS,
  payload
})

const getMessageFromHubFailed = () => ({
  type: Types.GET_MESSAGE_TOKENS_FROM_HUB_FAILED
})

// const postMessageMessageRequest = (payload: ApiTypes.Message.PostMessage) => ({
//   type: Types.POST_MESSAGE_MESSAGE_REQUEST,
//   payload
// })

// const postMessageMessageSucces = (payload: boolean) => ({
//   type: Types.POST_MESSAGE_MESSAGE_SUCCESS,
//   payload,
// })

// const deleteMessageMessageRequest = (payload: ApiTypes.Message.DeleteMessage) => ({
//   type: Types.DELETE_MESSAGE_MESSAGES_REQUEST,
//   payload
// })

// const deleteMessageMessageSucces = () => ({
//   type: Types.DELETE_MESSAGE_MESSAGES_SUCCESS,
// })

// const reportMessageMessageHubRequest = (payload: ApiTypes.Message.ReportMessageHub) => ({
//   type: Types.REPORT_MESSAGE_MESSAGES_HUB_REQUEST,
//   payload
// })

// const reportMessageMessageCentralRequest = (payload: ApiTypes.Message.ReportMessageCentral) => ({
//   type: Types.REPORT_MESSAGE_MESSAGES_CENTRAL_REQUEST,
//   payload
// })

// const reportMessageMessageSucces = () => ({
//   type: Types.REPORT_MESSAGE_MESSAGES_SUCCESS,
// })

// const editMessageMessageRequest = (payload: ApiTypes.Message.EditMessage) => ({
//   type: Types.EDIT_MESSAGE_MESSAGES_REQUEST,
//   payload
// })

// const editMessageMessageSucces = () => ({
//   type: Types.EDIT_MESSAGE_MESSAGES_SUCCESS,
// })

// const postMessageCommentRequest = (payload: ApiTypes.Message.PostComment) => ({
//   type: Types.POST_MESSAGE_COMMENT_REQUEST,
//   payload
// })

// const postMessageCommentSucces = (payload: boolean) => ({
//   type: Types.POST_MESSAGE_COMMENT_SUCCESS,
//   payload,
// })

// const editMessageCommentRequest = (payload: ApiTypes.Message.EditComment) => ({
//   type: Types.EDIT_MESSAGE_COMMENT_REQUEST,
//   payload
// })

// const editMessageCommentSucces = () => ({
//   type: Types.EDIT_MESSAGE_COMMENT_SUCCESS,
// })

// const deleteCommentRequest = (payload: ApiTypes.Message.DeleteComment) => ({
//   type: Types.DELETE_MESSAGE_COMMENT_REQUEST,
//   payload
// })

// const deleteMessageCommentSucces = () => ({
//   type: Types.DELETE_MESSAGE_COMMENT_SUCCESS,
// })

// const getMessageMessageUploadLinkRequest = (payload: ApiTypes.Message.UploadLinkRequest) => ({
//   type: Types.GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST,
//   payload,
// })

// const getMessageMessageUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
//   type: Types.GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS,
//   payload
// })

// const setAttachmentRequest = (payload: ApiTypes.Message.Attachment) => ({
//   type: Types.SET_MESSAGE_MESSAGES_ATTACHMENT_REQUEST,
//   payload,
// })

// const setAttachmentSuccess = () => ({
//   type: Types.SET_MESSAGE_MESSAGES_ATTACHMENT_SUCCESS,
// })

// const linkMessageMessageRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.LIKE_MESSAGE_MESSAGES_REQUEST,
//   payload,
// }) 

// const linkMessageMessageSuccess = () => ({
//   type: Types.LIKE_MESSAGE_MESSAGES_SUCCESS,
// })

// const hideMessageMessageRequest = (payload: ApiTypes.Message.Hide) => ({
//   type: Types.HIDE_MESSAGE_MESSAGES_REQUEST,
//   payload,
// })

// const hideMessageMessageSuccess = () => ({
//   type: Types.HIDE_MESSAGE_MESSAGES_SUCCESS,
// })

// const hideMessageCommentRequest = (payload: ApiTypes.Message.Hide) => ({
//   type: Types.HIDE_MESSAGE_COMMENT_REQUEST,
//   payload,
// })

// const hideMessageCommentSuccess = () => ({
//   type: Types.HIDE_MESSAGE_COMMENT_SUCCESS,
// })

// const linkMessageCommnetRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.LIKE_MESSAGE_COMMENT_REQUEST,
//   payload,
// })

// const linkMessageCommentSuccess = () => ({
//   type: Types.LIKE_MESSAGE_COMMENT_SUCCESS,
// })

// const getLikesForMessageMessageRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.GET_LIKES_FOR_MESSAGE_MESSAGES_REQUEST,
//   payload,
// })

// const getLikesForMessageMessageSuccess = (payload: ApiTypes.Message.LikesInfoData) => ({
//   type: Types.GET_LIKES_FOR_MESSAGE_MESSAGES_SUCCESS,
//   payload,
// })

// const getLikesForMessageCommentRequest = (payload: ApiTypes.Message.Like) => ({
//   type: Types.GET_LIKES_FOR_MESSAGE_COMMENT_REQUEST,
//   payload,
// })

// const getLikesForMessageCommentSuccess = (payload: ApiTypes.Message.LikesInfoData) => ({
//   type: Types.GET_LIKES_FOR_MESSAGE_COMMENT_SUCCESS,
//   payload,
// })

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

// const getMoreMessageFromHubRequest = (payload: ApiTypes.Message.MessagesFromHub) => ({
//   type: Types.GET_MORE_MESSAGE_FROM_HUB_REQUEST,
//   payload,
// })

// const getMoreMessageFromHubSuccess = (payload: {
//   hub: string
//   messages: ApiTypes.Message.Message[]
// }) => ({
//   type: Types.GET_MORE_MESSAGE_FROM_HUB_SUCCESS,
//   payload
// })

// const getMoreMessageFromHubFailed = () => ({
//   type: Types.GET_MORE_MESSAGE_FROM_HUB_FAILED,
// })

// const getMessageMessagesByIdFromHubRequest = (payload: ApiTypes.Message.MessagesById) => ({
//   type: Types.GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST,
//   payload,
// })

// const getMessageMessagesByIdFromHubSuccess = (payload: {
//   hub: string
//   messages: ApiTypes.Message.Message
// }) => ({
//   type: Types.GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS,
//   payload
// })

// const getMessageMessagesByIdFromHubFailed = () => ({
//   type: Types.GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED,
// })

// const resetMessageMessageById = () => ({
//   type: Types.RESET_MESSAGE_MESSAGES_BY_ID,
// })

// const cleanAllMessages = () => ({
//   type: Types.CLEAN_ALL_ACTION,
// })

export default {
  getMessageTokensRequest,
  getMessageTokensSuccess, 
//   postMessageMessageRequest,
//   postMessageMessageSucces,
  getMessageFromHubRequest,
  getUserLastMessageFromHubSuccess,
  getMessageFromHubFailed,
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
