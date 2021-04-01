import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  getMessages: async () => {
    return await axiosInstance.post('/rpc.TokenService/GetMessages', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getGroupMessages: async (data: ApiTypes.Feed.MessagesByGroupId) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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
  
  getGroupMessageToken: async (data: ApiTypes.Feed.MessagesByGroupId) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`/rpc.TokenService/PostMessage`, {group_id: data.body.group_id} ).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getCurrentHub: async () => {
    return await axiosInstance.post('/rpc.TokenService/PostMessage', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  postMessage: async (data: ApiTypes.Feed.PostMessage) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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
 
  deleteMessage: async (data: ApiTypes.Feed.DeleteMessage) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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
  
  editMessage: async (data: ApiTypes.Feed.EditMessage) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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
  
  getMessagesFromHub: async (data: ApiTypes.Feed.MessagesFromHub) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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

  getMessageById: async (data: ApiTypes.Feed.MessagesById) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Message`, data.body, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  postComment: async (data: ApiTypes.Feed.PostComment) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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

  editComment: async (data: ApiTypes.Feed.EditComment) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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
  
  deleteComment: async (data: ApiTypes.Feed.DeleteComment) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
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

  getUploadLink: async (data: ApiTypes.Feed.UploadLinkRequest) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.BlobService/UploadLink`, {
      'content_type': data.content_type,
      'file_name': data.file_name,
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  setAttachment: async (host: string, data: FormData) => {
    const config = {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    return await axiosInstance.post(host, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  likeMessage: async (data: ApiTypes.Feed.Like) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${data.host}/rpc.MessageService/LikeMessage`, {
      'message_id': data.id,
      'unlike': data?.unlike
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  likeComment: async (data: ApiTypes.Feed.Like) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/LikeComment`, {
      'comment_id': data.id,
      'unlike': data?.unlike
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  hideMessage: async (data: ApiTypes.Feed.Hide) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/SetMessageVisibility`, {
      'message_id': data.id,
      'visibility': false,
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  hideComment: async (data: ApiTypes.Feed.Hide) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/SetCommentVisibility`, {
      'comment_id': data.id,
      'visibility': false,
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getlikesForMessage: async (data: ApiTypes.Feed.Like) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/MessageLikes`, {
      'message_id': data.id
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  getlikesForComment: async (data: ApiTypes.Feed.Like) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/CommentLikes`, {
      'comment_id': data.id
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  reportMessageHub: async (data: ApiTypes.Feed.ReportMessageHub) => {
    const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }
    return await axiosInstance.post(`${data.host}/rpc.MessageService/ReportMessage`, {
      'message_id': data.body.message_id,
      'report': data.body.report,
    }, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  reportMessageCentral: async (data: ApiTypes.Feed.ReportMessageCentral) => {
    return await axiosInstance.post(`/rpc.MessageHubService/ReportMessage`, data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}