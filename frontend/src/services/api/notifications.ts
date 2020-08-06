import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

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

  cleanNotificationsInCentral: async (data: ApiTypes.Notifications.CleanNotification) => {
    return await axiosInstance.post(`/rpc.NotificationService/Clean`, data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  cleanNotificationsInNode: async (host: string, data: ApiTypes.Notifications.CleanNotification) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${host}/rpc.NotificationService/Clean`, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  }
}
