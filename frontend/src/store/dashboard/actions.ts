
import { ApiTypes } from 'src/types'

export enum Types {
  GET_MESSAGE_REPORTS_REQUEST = 'GET_MESSAGE_REPORTS_REQUEST',
  
  GET_MESSAGE_REPORTS_FROM_HUB_REQUEST = 'GET_MESSAGE_REPORTS_FROM_HUB_REQUEST', 
  GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS = 'GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS', 
  
  RESOLVE_REPORT_REQUEST = 'RESOLVE_REPORT_REQUEST', 
  DELETE_REPORTED_MESSAGE_REQUEST = 'DELETE_REPORTED_MESSAGE_REQUEST', 
  BLOCK_REPORTED_USER_REQUEST = 'BLOCK_REPORTED_USER_REQUEST',
  BLOCK_USER_REQUEST = 'BLOCK_USER_REQUEST',
}

const getMessageReportsRequest = () => ({
  type: Types.GET_MESSAGE_REPORTS_REQUEST,
})

const getMessageReportsFronHubRequest = (payload: string) => ({
  type: Types.GET_MESSAGE_REPORTS_FROM_HUB_REQUEST,
  payload
})

const getMessageReportsFronHubSuccess = (payload: ApiTypes.Dashboard.ObjectionableContent[]) => ({
  type: Types.GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS,
  payload
})

const resolveReportRequest = (payload: ApiTypes.Dashboard.ResolveReport) => ({
  type: Types.RESOLVE_REPORT_REQUEST,
  payload
})

const deleteReportedMessageRequest = (payload: ApiTypes.Dashboard.DeleteReportedMessage) => ({
  type: Types.DELETE_REPORTED_MESSAGE_REQUEST,
  payload
})

const blockReportedUserRequest = (payload: ApiTypes.Dashboard.EjectUser) => ({
  type: Types.BLOCK_REPORTED_USER_REQUEST,
  payload
})

const blockUserRequest = (payload: ApiTypes.Dashboard.EjectUser) => ({
  type: Types.BLOCK_USER_REQUEST,
  payload
})

export default {
  getMessageReportsRequest,
  getMessageReportsFronHubRequest,
  getMessageReportsFronHubSuccess,
  resolveReportRequest,
  deleteReportedMessageRequest,
  blockReportedUserRequest,
  blockUserRequest,
}