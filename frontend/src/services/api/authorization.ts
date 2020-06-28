import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  login: async (data: ApiTypes.Login) => {
    return await axiosInstance.post('/rpc.AuthService/Login', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}