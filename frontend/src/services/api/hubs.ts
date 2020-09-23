import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  createHub: async (data: ApiTypes.Hubs.Create) => {
    return await axiosInstance.post('/rpc.MessageHubService/Register', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getHubs: async () => {
    return await axiosInstance.post('/rpc.MessageHubService/Hubs', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  approveHub: async (data: ApiTypes.Hubs.ApproveHub) => {
    return await axiosInstance.post('/rpc.MessageHubService/Approve', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  removeHub: async (data: ApiTypes.Hubs.RemoveHub) => {
    return await axiosInstance.post('/rpc.MessageHubService/Remove', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  verifyHub: async (data: ApiTypes.Hubs.ApproveHub) => {
    return await axiosInstance.post('/rpc.MessageHubService/Verify', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}