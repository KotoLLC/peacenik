import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'
import { getHeaderConfig } from './commonAPIFunctions'

export default {
  getMessagesToken: async () => {
    return await axiosInstance.post('/rpc.TokenService/GetMessages', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  getGroupMessages: async (data: ApiTypes.Groups.MessagesById) => {
    return await axiosInstance.post(`${data.host}/rpc.MessageService/Messages`, data.body, getHeaderConfig()).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getGroupPostMessageToken: async (data: ApiTypes.Groups.MessagesById) => {
    return await axiosInstance.post(`/rpc.TokenService/PostMessage`, {group_id: data.body.group_id} ).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  addGroup: async (data: ApiTypes.Groups.AddGroup) => {
    return await axiosInstance.post('/rpc.GroupService/AddGroup', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
 
  editGroup: async (data: ApiTypes.Groups.EditGroup) => {
    return await axiosInstance.post('/rpc.GroupService/EditGroup', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  getPublicGroups: async () => {
    return await axiosInstance.post('/rpc.GroupService/PublicGroups', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  getGroupDetails: async (id: string) => {
    return await axiosInstance.post('/rpc.GroupService/GroupDetails', {
      group_id: id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  deleteGroup: async (id: string) => {
    return await axiosInstance.post('/rpc.GroupService/DeleteGroup', {
      group_id: id
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  requestJoinGroup: async (data: ApiTypes.Groups.RequestJoin) => {
    return await axiosInstance.post('/rpc.GroupService/RequestJoin', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  getInvitesToConfirm: async () => {
    return await axiosInstance.post('/rpc.GroupService/InvitesToConfirm', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
 
  сonfirmInvite: async (data: ApiTypes.Groups.ConfirmDenyInvite) => {
    return await axiosInstance.post('/rpc.GroupService/ConfirmInvite', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  denyInvite: async (data: ApiTypes.Groups.ConfirmDenyInvite) => {
    return await axiosInstance.post('/rpc.GroupService/DenyInvite', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 

  deleteMember: async (data: ApiTypes.Groups.DeleteMember) => {
    return await axiosInstance.post('/rpc.GroupService/RemoveUser', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  leaveGroup: async (value: string) => {
    return await axiosInstance.post('/rpc.GroupService/LeaveGroup', {
      group_id: value
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  deleteJoinRequest: async (data: ApiTypes.Groups.DeleteJoinRequest) => {
    return await axiosInstance.post('/rpc.GroupService/DeleteJoinRequest', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
 
  addUserToGroup: async (data: ApiTypes.Groups.AddUserToGroup) => {
    return await axiosInstance.post('/rpc.GroupService/AddUser', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 

  setGroupImage: async (host: string, data: FormData) => {
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

  getUploadLink: async (data: ApiTypes.UploadLinkRequest) => {
    return await axiosInstance.post('/rpc.BlobService/UploadLink', {
      'content_type': data.content_type,
      'file_name': data.file_name,
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}