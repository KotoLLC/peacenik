import { axiosInstance } from './index'
import { ApiDataTypes } from './../../types'

export default {
  login: async (data: ApiDataTypes.Login) => {
    return await axiosInstance.post('/auth/login', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}