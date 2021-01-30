import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
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
}