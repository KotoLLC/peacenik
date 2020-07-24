import { axiosInstance } from './index'
import { ApiTypes } from './../../types'

export default {
  getProfile: async () => {
    return await axiosInstance.post('/rpc.UserService/Me', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getUploadLink: async (value: string) => {
    return await axiosInstance.post('/rpc.BlobService/UploadLink', {
      'content_type': value
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
 
  setAvatar: async (host: string, data: FormData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    return await axiosInstance.post(host, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  editProfile: async (data: ApiTypes.Profile.EditProfile) => {
    return await axiosInstance.post('/rpc.UserService/EditProfile', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}