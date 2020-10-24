import { axiosInstance } from './index'
import { CommonTypes } from 'src/types'

export default {
  getNotificationsFromHub: async (host: string) => {
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
  
  getNotificationsFromUserHub: async () => {
    return await axiosInstance.post(`/rpc.NotificationService/Notifications`, {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  cleanNotificationsInUserHub: async (data: CommonTypes.NotificationTypes.LastKnown) => {
    return await axiosInstance.post(`/rpc.NotificationService/Clean`, {
      last_known_id: data.id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  cleanNotificationsInHub: async (data: CommonTypes.NotificationTypes.LastKnown) => {
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
  },

  markAsReadNotificationsInUserHub: async (data: CommonTypes.NotificationTypes.LastKnown) => {
    return await axiosInstance.post(`/rpc.NotificationService/MarkRead`, {
      last_known_id: data.id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  markAsReadNotificationsInHub: async (data: CommonTypes.NotificationTypes.LastKnown) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.NotificationService/MarkRead`, {
      last_known_id: data.id
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  }
}
