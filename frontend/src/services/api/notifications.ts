import { axiosInstance } from './index'
import { ApiTypes, CommonTypes } from 'src/types'

export default {
  getNotificationsFromNode: async (host: string) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${host}/rpc.NotificationService/Notifications`, {}, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getNotificationsFromCentral: async () => {
    return await axiosInstance.post(`/rpc.NotificationService/Notifications`, {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  cleanNotificationsInCentral: async (data: CommonTypes.NotificationTypes.LastKnown) => {
    return await axiosInstance.post(`/rpc.NotificationService/Clean`, {
      last_known_id: data.id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  cleanNotificationsInNode: async (data: CommonTypes.NotificationTypes.LastKnown) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.NotificationService/Clean`, {
      last_known_id: data.id
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  }
}
