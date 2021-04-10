
import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {

  getMsgToken: async () => {
    return await axiosInstance.post('/rpc.TokenService/GetMessages', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  setAttachment: async (host: string, data: FormData) => {
    const config = {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    return await axiosInstance.post(host, data, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },

  getUploadLink: async (data: ApiTypes.UploadLinkRequest) => {
    return await axiosInstance.post('/rpc.BlobService/UploadLink', {
      'content_type': data.content_type,
      'file_name': data.file_name,
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}
