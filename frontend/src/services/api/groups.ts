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
}