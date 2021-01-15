import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  addGroup: async (data: ApiTypes.Groups.AddGroup) => {
    return await axiosInstance.post('/rpc.GroupService/AddGroup', data).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
}