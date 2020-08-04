import { axiosInstance } from './index'
// import { ApiTypes } from '../../types'

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
}