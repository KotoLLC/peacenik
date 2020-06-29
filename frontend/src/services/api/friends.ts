import { axiosInstance } from './index'

export default {
  getFriends: async () => {
    return await axiosInstance.post('/rpc.UserService/Friends', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}