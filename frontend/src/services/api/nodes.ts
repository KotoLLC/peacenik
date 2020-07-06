import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  createNode: async (data: ApiTypes.Nodes.Create) => {
    return await axiosInstance.post('/rpc.NodeService/Register', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}