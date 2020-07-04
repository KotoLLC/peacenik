import { axiosInstance } from './index'
import { ApiTypes } from './../../types/index'

export default {
  getFriends: async () => {
    return await axiosInstance.post('/rpc.UserService/Friends', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getFriendsOfFriends: async () => {
    return await axiosInstance.post('/rpc.UserService/FriendsOfFriends', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  addFriend: async (data: ApiTypes.FriendRequest) => {
    return await axiosInstance.post('/rpc.InviteService/Create', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  getInvitations: async () => {
    return await axiosInstance.post('/rpc.InviteService/ForMe', {}).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  acceptInvitation: async (data: ApiTypes.AcceptInvitation) => {
    return await axiosInstance.post('/rpc.InviteService/Accept', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
  
  rejectInvitation: async (data: ApiTypes.RejectInvitation) => {
    return await axiosInstance.post('/rpc.InviteService/Reject', data).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}