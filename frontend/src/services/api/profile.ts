import { axiosInstance } from './index'

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
 
  setAvatar: async (host, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    return await axiosInstance.post(host, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}