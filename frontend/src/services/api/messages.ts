import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'
import { getHeaderConfig } from './commonAPIFunctions'

export default {  
  
  getUserLastMessagesFromHub: async (data: ApiTypes.Messages.UserMessagesFromHub) => {
    return await Promise.all(data.friends.map(friend=>axiosInstance.post(`${data.host}/rpc.MessageService/Messages`, {
      friend_id:friend.id,
      token: data.token
    }, getHeaderConfig()))).then(response => {
      return response.filter(item=>item?.data?.messages.length && item?.data?.messages[0].created_at ).map((item, i)=>({
        user_id: data.friends[i].id,
        full_name: data.friends[i].full_name,
        username: data.friends[i].username,
        messages: item.data.messages,
        lastMessageDate: item.data.messages[0].created_at
      }))
    }).catch(error => {
      throw error;
    })
  },
 
  postMessage: async (data: ApiTypes.Feed.PostMessage) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Post`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  deleteMessage: async (data: ApiTypes.Feed.DeleteMessage) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Delete`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  editMessage: async (data: ApiTypes.Feed.EditMessage) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Edit`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  

  getMessageById: async (data: ApiTypes.Feed.MessagesById) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Message`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  postComment: async (data: ApiTypes.Feed.PostComment) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/PostComment`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  editComment: async (data: ApiTypes.Feed.EditComment) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/EditComment`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  deleteComment: async (data: ApiTypes.Feed.DeleteComment) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/DeleteComment`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getUploadLink: async (data: ApiTypes.Feed.UploadLinkRequest) => {
    return await axiosInstance.post(`${data.host}/rpc.BlobService/UploadLink`, {
      'content_type': data.content_type,
      'file_name': data.file_name,
    }, getHeaderConfig()).then(response => {
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

    return await axiosInstance.post(`${data.host}/rpc.MessageService/LikeMessage`, {
      'message_id': data.id,
      'unlike': data?.unlike
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  likeComment: async (data: ApiTypes.Feed.Like) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/LikeComment`, {
      'comment_id': data.id,
      'unlike': data?.unlike
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  hideMessage: async (data: ApiTypes.Feed.Hide) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/SetMessageVisibility`, {
      'message_id': data.id,
      'visibility': false,
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  hideComment: async (data: ApiTypes.Feed.Hide) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/SetCommentVisibility`, {
      'comment_id': data.id,
      'visibility': false,
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getlikesForMessage: async (data: ApiTypes.Feed.Like) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/MessageLikes`, {
      'message_id': data.id
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  getlikesForComment: async (data: ApiTypes.Feed.Like) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/CommentLikes`, {
      'comment_id': data.id
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  reportMessageHub: async (data: ApiTypes.Feed.ReportMessageHub) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/ReportMessage`, {
      'message_id': data.body.message_id,
      'report': data.body.report,
    }, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  reportMessageCentral: async (data: ApiTypes.Feed.ReportMessageCentral) => {
    return await axiosInstance.post(`/rpc.MessageHubService/ReportMessage`, data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}