import { axiosInstance } from './index'

export default {
  getProfile: async () => {
    return await axiosInstance.post('/rpc.UserService/Me', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}