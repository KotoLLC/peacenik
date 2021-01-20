import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  getMessageReports: async (host: string) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${host}/rpc.MessageService/MessageReports`, {}, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  resolveReport: async (data: ApiTypes.Dashboard.ResolveReport) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${data.host}/rpc.MessageService/ResolveMessageReport`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  deleteReportedMessage: async (data: ApiTypes.Dashboard.DeleteReportedMessage) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${data.host}/rpc.MessageService/DeleteReportedMessage`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  blockReportedUser: async (data: ApiTypes.Dashboard.EjectUser) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${data.host}/rpc.MessageService/BlockReportedUser`, { 
      report_id: data.report_id 
    }, config).then(response => {
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