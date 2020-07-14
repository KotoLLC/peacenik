import { axiosInstance } from './index'
import { ApiTypes } from './../../types/index'

export default {
  getMessages: async () => {
    return await axiosInstance.post('/rpc.TokenService/GetMessages', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getCurrentNode: async () => {
    return await axiosInstance.post('/rpc.TokenService/PostMessage', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  postMessage: async (data: ApiTypes.Messages.PostMessage) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Post`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  deleteMessage: async (data: ApiTypes.Messages.DeleteMessage) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Delete`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getMessagesFromNode: async (data: ApiTypes.Messages.MessagesFromNode) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Messages`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}