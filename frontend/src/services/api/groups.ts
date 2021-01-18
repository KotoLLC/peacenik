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
}