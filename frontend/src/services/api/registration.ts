import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  registerUser: async (data: ApiTypes.RegisterUser) => {
    return await axiosInstance.post('/rpc.AuthService/Register', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },

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