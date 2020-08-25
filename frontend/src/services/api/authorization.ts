import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  login: async (data: ApiTypes.Login) => {
    return await axiosInstance.post('/rpc.AuthService/Login', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  logout: async () => {
    return await axiosInstance.post('/rpc.AuthService/Logout', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getAuthToken: async () => {
    return await axiosInstance.post('/rpc.TokenService/Auth', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  forgotPassword: async (data: ApiTypes.ForgotPassword) => {
    return await axiosInstance.post('/rpc.AuthService/SendResetPasswordLink', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  resetPassword: async (data: ApiTypes.ResetPassword) => {
    return await axiosInstance.post('/rpc.AuthService/ResetPassword', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}