import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  sendConfirmLink: async () => {
    return await axiosInstance.post('/rpc.AuthService/SendConfirmLink', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  confirmUser: async (data: ApiTypes.Token) => {
    return await axiosInstance.post('/rpc.AuthService/Confirm', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}