import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'
import { getHeaderConfig } from './commonAPIFunctions'

export default {
  getMessageReports: async (host: string) => {
    return await axiosInstance.post(`${host}/rpc.MessageService/MessageReports`, {}, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  resolveReport: async (data: ApiTypes.Dashboard.ResolveReport) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/ResolveMessageReport`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  deleteReportedMessage: async (data: ApiTypes.Dashboard.DeleteReportedMessage) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/DeleteReportedMessage`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  blockReportedUser: async (data: ApiTypes.Dashboard.EjectUser) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/BlockReportedUser`, { 
      report_id: data.report_id 
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  blockUser: async (data: ApiTypes.Dashboard.EjectUser) => {
    return await axiosInstance.post(`/rpc.MessageHubService/BlockUser`, {
      hub_id: data.host,
      user_id: data.user_id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}