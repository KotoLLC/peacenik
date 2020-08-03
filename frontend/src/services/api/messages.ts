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
  
  editMessage: async (data: ApiTypes.Messages.EditMessage) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Edit`, data.body, config).then(response => {
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

  postComment: async (data: ApiTypes.Messages.PostComment) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/PostComment`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  editComment: async (data: ApiTypes.Messages.EditComment) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/EditComment`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  deleteComment: async (data: ApiTypes.Messages.DeleteComment) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/DeleteComment`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getUploadLink: async (data: ApiTypes.Messages.UploadLinkRequest) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.BlobService/UploadLink`, {
      'content_type': data.value
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  setAttachment: async (host: string, data: FormData) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      headers: {
        // Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      }
    }
    return await axiosInstance.post(host, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}