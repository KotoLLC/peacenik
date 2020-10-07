
import { ApiTypes } from 'src/types'

export enum Types {
  GET_MESSAGE_REPORTS_REQUEST = 'GET_MESSAGE_REPORTS_REQUEST',
  
  GET_MESSAGE_REPORTS_FROM_HUB_REQUEST = 'GET_MESSAGE_REPORTS_FROM_HUB_REQUEST', 
  GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS = 'GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS', 
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

export default {
  getMessageReportsRequest,
  getMessageReportsFronHubRequest,
  getMessageReportsFronHubSuccess,
}