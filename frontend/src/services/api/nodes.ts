import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  createNode: async (data: ApiTypes.Nodes.Create) => {
    return await axiosInstance.post('/rpc.NodeService/Register', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getNodes: async () => {
    return await axiosInstance.post('/rpc.NodeService/Nodes', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  approveNode: async (data: ApiTypes.Nodes.ApproveNode) => {
    return await axiosInstance.post('/rpc.NodeService/Approve', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  removeNode: async (data: ApiTypes.Nodes.RemoveNode) => {
    return await axiosInstance.post('/rpc.NodeService/Remove', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}