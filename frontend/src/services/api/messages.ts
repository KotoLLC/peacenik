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
    const authToken = localStorage.getItem('kotoAuthToken')
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        withCredentials: true,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Post`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}