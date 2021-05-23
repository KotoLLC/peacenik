
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  GET_FEED_TOKENS_REQUEST                         = 'GET_FEED_TOKENS_REQUEST',
  GET_FEED_TOKENS_SUCCESS                         = 'GET_FEED_TOKENS_SUCCESS',

  GET_MORE_FEED_REQUEST                           = 'GET_MORE_FEED_REQUEST',
  GET_MORE_FEED_SUCCESS                           = 'GET_MORE_FEED_SUCCESS',
  GET_MORE_FEED_FAILED                            = 'GET_MORE_FEED_FAILED',

  GET_CURRENT_HUB_REQUEST                         = 'GET_CURRENT_HUB_REQUEST',
  GET_CURRENT_HUB_SUCCESS                         = 'GET_CURRENT_HUB_SUCCESS',
  GET_CURRENT_HUB_FAILED                          = 'GET_CURRENT_HUB_FAILED',

  GET_FEED_TOKENS_FROM_HUB_REQUEST                = 'GET_FEED_TOKENS_FROM_HUB_REQUEST',
  GET_FEED_TOKENS_FROM_HUB_SUCCESS                = 'GET_FEED_TOKENS_FROM_HUB_SUCCESS',
  GET_FEED_TOKENS_FROM_HUB_FAILED                 = 'GET_FEED_TOKENS_FROM_HUB_FAILED',
  
  GET_MORE_FEED_FROM_HUB_REQUEST                  = 'GET_MORE_FEED_FROM_HUB_REQUEST',
  GET_MORE_FEED_FROM_HUB_SUCCESS                  = 'GET_MORE_FEED_FROM_HUB_SUCCESS',
  GET_MORE_FEED_FROM_HUB_FAILED                   = 'GET_MORE_FEED_FROM_HUB_FAILED',
  
  GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST = 'GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST',
  GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS = 'GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS',
  GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED  = 'GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED',

  RESET_FEED_MESSAGES_BY_ID                       = 'RESET_FEED_MESSAGES_BY_ID',
  
  CLEAN_ALL_FEED                                  = 'CLEAN_ALL_FEED',

  POST_FEED_MESSAGE_REQUEST = 'POST_FEED_MESSAGE_REQUEST',
  POST_FEED_MESSAGE_SUCCESS = 'POST_FEED_MESSAGE_SUCCESS',

  DELETE_FEED_MESSAGES_REQUEST = 'DELETE_FEED_MESSAGES_REQUEST',
  DELETE_FEED_MESSAGES_SUCCESS = 'DELETE_FEED_MESSAGES_SUCCESS',
  
  REPORT_FEED_MESSAGES_HUB_REQUEST = 'REPORT_FEED_MESSAGES_HUB_REQUEST',
  REPORT_FEED_MESSAGES_CENTRAL_REQUEST = 'REPORT_FEED_MESSAGES_CENTRAL_REQUEST',
  REPORT_FEED_MESSAGES_SUCCESS = 'REPORT_FEED_MESSAGES_SUCCESS',

  EDIT_FEED_MESSAGES_REQUEST = 'EDIT_FEED_MESSAGES_REQUEST',
  EDIT_FEED_MESSAGES_SUCCESS = 'EDIT_FEED_MESSAGES_SUCCESS',

  POST_FEED_COMMENT_REQUEST = 'POST_FEED_COMMENT_REQUEST',
  POST_FEED_COMMENT_SUCCESS = 'POST_FEED_COMMENT_SUCCESS',

  EDIT_FEED_COMMENT_REQUEST = 'EDIT_FEED_COMMENT_REQUEST',
  EDIT_FEED_COMMENT_SUCCESS = 'EDIT_FEED_COMMENT_SUCCESS',

  DELETE_FEED_COMMENT_REQUEST = 'DELETE_FEED_COMMENT_REQUEST',
  DELETE_FEED_COMMENT_SUCCESS = 'DELETE_FEED_COMMENT_SUCCESS',

  GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST = 'GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST',
  GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS = 'GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS',

  SET_FEED_MESSAGES_ATTACHMENT_REQUEST = 'SET_FEED_MESSAGES_ATTACHMENT_REQUEST',
  SET_FEED_MESSAGES_ATTACHMENT_SUCCESS = 'SET_FEED_MESSAGES_ATTACHMENT_SUCCESS',

  LIKE_FEED_MESSAGES_REQUEST = 'LIKE_FEED_MESSAGES_REQUEST',
  LIKE_FEED_MESSAGES_SUCCESS = 'LIKE_FEED_MESSAGES_SUCCESS',
  
  LIKE_FEED_COMMENT_REQUEST = 'LIKE_FEED_COMMENT_REQUEST',
  LIKE_FEED_COMMENT_SUCCESS = 'LIKE_FEED_COMMENT_SUCCESS',
  
  GET_LIKES_FOR_FEED_MESSAGES_REQUEST = 'GET_LIKES_FOR_FEED_MESSAGES_REQUEST',
  GET_LIKES_FOR_FEED_MESSAGES_SUCCESS = 'GET_LIKES_FOR_FEED_MESSAGES_SUCCESS',
  
  GET_LIKES_FOR_FEED_COMMENT_REQUEST = 'GET_LIKES_FOR_FEED_COMMENT_REQUEST',
  GET_LIKES_FOR_FEED_COMMENT_SUCCESS = 'GET_LIKES_FOR_FEED_COMMENT_SUCCESS',

  HIDE_FEED_MESSAGES_REQUEST = 'HIDE_FEED_MESSAGES_REQUEST',
  HIDE_FEED_MESSAGES_SUCCESS = 'HIDE_FEED_MESSAGES_SUCCESS',

  HIDE_FEED_COMMENT_REQUEST = 'HIDE_FEED_COMMENT_REQUEST',
  HIDE_FEED_COMMENT_SUCCESS = 'HIDE_FEED_COMMENT_SUCCESS',

  SET_POST_UPDATED                = 'SET_POST_UPDATED'

}

const getFeedTokensRequest = () => ({
  type: Types.GET_FEED_TOKENS_REQUEST,
})

const getFeedTokensSuccess = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
  type: Types.GET_FEED_TOKENS_SUCCESS,
  payload
})

const getCurrentHubRequest = () => ({
  type: Types.GET_CURRENT_HUB_REQUEST,
})

const getCurrentHubSuccess = (payload: CommonTypes.HubTypes.CurrentHub) => ({
  type: Types.GET_CURRENT_HUB_SUCCESS,
  payload
})

const getCurrentHubFailed = () => ({
  type: Types.GET_CURRENT_HUB_FAILED,
})

const getFeedFromHubRequest = (payload: ApiTypes.Feed.MessagesFromHub) => ({
  type: Types.GET_FEED_TOKENS_FROM_HUB_REQUEST,
  payload,
})

const getFeedFromHubSuccess = (payload: {
  hub: string
  messages: ApiTypes.Feed.Message[]
}) => ({
  type: Types.GET_FEED_TOKENS_FROM_HUB_SUCCESS,
  payload
})

const getFeedFromHubFailed = () => ({
  type: Types.GET_FEED_TOKENS_FROM_HUB_FAILED
})

const postFeedMessageRequest = (payload: ApiTypes.Feed.PostMessage) => ({
  type: Types.POST_FEED_MESSAGE_REQUEST,
  payload
})

const postFeedMessageSucces = (payload: boolean) => ({
  type: Types.POST_FEED_MESSAGE_SUCCESS,
  payload,
})

const deleteFeedMessageRequest = (payload: ApiTypes.Feed.DeleteMessage) => ({
  type: Types.DELETE_FEED_MESSAGES_REQUEST,
  payload
})

const deleteFeedMessageSucces = () => ({
  type: Types.DELETE_FEED_MESSAGES_SUCCESS,
})

const reportFeedMessageHubRequest = (payload: ApiTypes.Feed.ReportMessageHub) => ({
  type: Types.REPORT_FEED_MESSAGES_HUB_REQUEST,
  payload
})

const reportFeedMessageCentralRequest = (payload: ApiTypes.Feed.ReportMessageCentral) => ({
  type: Types.REPORT_FEED_MESSAGES_CENTRAL_REQUEST,
  payload
})

const reportFeedMessageSucces = () => ({
  type: Types.REPORT_FEED_MESSAGES_SUCCESS,
})

const editFeedMessageRequest = (payload: ApiTypes.Feed.EditMessage) => ({
  type: Types.EDIT_FEED_MESSAGES_REQUEST,
  payload
})

const editFeedMessageSucces = () => ({
  type: Types.EDIT_FEED_MESSAGES_SUCCESS,
})

const postFeedCommentRequest = (payload: ApiTypes.Feed.PostComment) => ({
  type: Types.POST_FEED_COMMENT_REQUEST,
  payload
})

const postFeedCommentSucces = (payload: boolean) => ({
  type: Types.POST_FEED_COMMENT_SUCCESS,
  payload,
})

const editFeedCommentRequest = (payload: ApiTypes.Feed.EditComment) => ({
  type: Types.EDIT_FEED_COMMENT_REQUEST,
  payload
})

const editFeedCommentSucces = () => ({
  type: Types.EDIT_FEED_COMMENT_SUCCESS,
})

const deleteCommentRequest = (payload: ApiTypes.Feed.DeleteComment) => ({
  type: Types.DELETE_FEED_COMMENT_REQUEST,
  payload
})

const deleteFeedCommentSucces = () => ({
  type: Types.DELETE_FEED_COMMENT_SUCCESS,
})

const getFeedMessageUploadLinkRequest = (payload: ApiTypes.Feed.UploadLinkRequest) => ({
  type: Types.GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_REQUEST,
  payload,
})

const getFeedMessageUploadLinkSucces = (payload: ApiTypes.UploadLink | null) => ({
  type: Types.GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS,
  payload
})

const setAttachmentRequest = (payload: ApiTypes.Feed.Attachment) => ({
  type: Types.SET_FEED_MESSAGES_ATTACHMENT_REQUEST,
  payload,
})

const setAttachmentSuccess = () => ({
  type: Types.SET_FEED_MESSAGES_ATTACHMENT_SUCCESS,
})

const linkFeedMessageRequest = (payload: ApiTypes.Feed.Like) => ({
  type: Types.LIKE_FEED_MESSAGES_REQUEST,
  payload,
}) 

const linkFeedMessageSuccess = () => ({
  type: Types.LIKE_FEED_MESSAGES_SUCCESS,
})

const hideFeedMessageRequest = (payload: ApiTypes.Feed.Hide) => ({
  type: Types.HIDE_FEED_MESSAGES_REQUEST,
  payload,
})

const hideFeedMessageSuccess = () => ({
  type: Types.HIDE_FEED_MESSAGES_SUCCESS,
})

const hideFeedCommentRequest = (payload: ApiTypes.Feed.Hide) => ({
  type: Types.HIDE_FEED_COMMENT_REQUEST,
  payload,
})

const hideFeedCommentSuccess = () => ({
  type: Types.HIDE_FEED_COMMENT_SUCCESS,
})

const linkFeedCommnetRequest = (payload: ApiTypes.Feed.Like) => ({
  type: Types.LIKE_FEED_COMMENT_REQUEST,
  payload,
})

const linkFeedCommentSuccess = () => ({
  type: Types.LIKE_FEED_COMMENT_SUCCESS,
})

const getLikesForFeedMessageRequest = (payload: ApiTypes.Feed.Like) => ({
  type: Types.GET_LIKES_FOR_FEED_MESSAGES_REQUEST,
  payload,
})

const getLikesForFeedMessageSuccess = (payload: ApiTypes.Feed.LikesInfoData) => ({
  type: Types.GET_LIKES_FOR_FEED_MESSAGES_SUCCESS,
  payload,
})

const getLikesForFeedCommentRequest = (payload: ApiTypes.Feed.Like) => ({
  type: Types.GET_LIKES_FOR_FEED_COMMENT_REQUEST,
  payload,
})

const getLikesForFeedCommentSuccess = (payload: ApiTypes.Feed.LikesInfoData) => ({
  type: Types.GET_LIKES_FOR_FEED_COMMENT_SUCCESS,
  payload,
})

const getMoreFeedRequest = () => ({
  type: Types.GET_MORE_FEED_REQUEST,
})

const getMoreFeedSucces = (payload: CommonTypes.HubTypes.CurrentHub[]) => ({
  type: Types.GET_MORE_FEED_SUCCESS,
  payload
})

const getMoreFeedFailed = () => ({
  type: Types.GET_MORE_FEED_FAILED,
})

const getMoreFeedFromHubRequest = (payload: ApiTypes.Feed.MessagesFromHub) => ({
  type: Types.GET_MORE_FEED_FROM_HUB_REQUEST,
  payload,
})

const getMoreFeedFromHubSuccess = (payload: {
  hub: string
  messages: ApiTypes.Feed.Message[]
}) => ({
  type: Types.GET_MORE_FEED_FROM_HUB_SUCCESS,
  payload
})

const getMoreFeedFromHubFailed = () => ({
  type: Types.GET_MORE_FEED_FROM_HUB_FAILED,
})

const getFeedMessagesByIdFromHubRequest = (payload: ApiTypes.Feed.MessagesById) => ({
  type: Types.GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_REQUEST,
  payload,
})

const getFeedMessagesByIdFromHubSuccess = (payload: {
  hub: string
  messages: ApiTypes.Feed.Message
}) => ({
  type: Types.GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS,
  payload
})

const getFeedMessagesByIdFromHubFailed = () => ({
  type: Types.GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED,
})

const resetFeedMessageById = () => ({
  type: Types.RESET_FEED_MESSAGES_BY_ID,
})

const cleanAllFeeds = () => ({
  type: Types.CLEAN_ALL_FEED,
})

const setPostUpdated = (payload: boolean) => ({
  type: Types.SET_POST_UPDATED,
  payload
})

export default {
  getFeedTokensRequest,
  getFeedTokensSuccess,
  getCurrentHubRequest,
  getCurrentHubSuccess,
  getCurrentHubFailed,
  postFeedMessageRequest,
  postFeedMessageSucces,
  getFeedFromHubRequest,
  getFeedFromHubSuccess,
  getFeedFromHubFailed,
  deleteFeedMessageRequest,
  deleteFeedMessageSucces,
  editFeedMessageRequest,
  editFeedMessageSucces,
  postFeedCommentRequest,
  postFeedCommentSucces,
  editFeedCommentRequest,
  editFeedCommentSucces,
  deleteCommentRequest,
  deleteFeedCommentSucces,
  getFeedMessageUploadLinkRequest,
  getFeedMessageUploadLinkSucces,
  setAttachmentRequest,
  setAttachmentSuccess,
  linkFeedMessageRequest,
  linkFeedMessageSuccess,
  linkFeedCommnetRequest,
  linkFeedCommentSuccess,
  getLikesForFeedMessageRequest,
  getLikesForFeedMessageSuccess,
  getLikesForFeedCommentRequest,
  getLikesForFeedCommentSuccess,
  getMoreFeedRequest,
  getMoreFeedSucces,
  getMoreFeedFailed,
  getMoreFeedFromHubRequest,
  getMoreFeedFromHubSuccess,
  getMoreFeedFromHubFailed,
  getFeedMessagesByIdFromHubRequest,
  getFeedMessagesByIdFromHubSuccess,
  resetFeedMessageById,
  getFeedMessagesByIdFromHubFailed,
  hideFeedMessageRequest,
  hideFeedMessageSuccess,
  hideFeedCommentRequest,
  hideFeedCommentSuccess,
  reportFeedMessageHubRequest,
  reportFeedMessageCentralRequest,
  reportFeedMessageSucces,
  cleanAllFeeds,
  setPostUpdated,
}