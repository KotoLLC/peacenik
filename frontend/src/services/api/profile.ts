import { axiosInstance } from './index'
import { ApiTypes } from 'src/types'

export default {
  getProfile: async () => {
    return await axiosInstance.post('/rpc.UserService/Me', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  getUsers: async (ids: string[]) => {
    return await axiosInstance.post('/rpc.UserService/Users', {
      user_ids: ids,
    }).then(response => {
      return response
    }).catch(error => ({ error }))
  }, 
  
  disableUser: async (value: string) => {
    return await axiosInstance.post('/rpc.UserService/BlockUser', {
      user_id: value,
    }).then(response => {
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
 
  setAvatar: async (host: string, data: FormData) => {
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

  editProfile: async (data: ApiTypes.Profile.EditProfile) => {
    return await axiosInstance.post('/rpc.UserService/EditProfile', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}