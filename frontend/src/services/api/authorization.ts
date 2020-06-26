import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  login: async (data: ApiTypes.Login) => {
    return await axiosInstance.post('/auth/login', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}