import { axiosInstance } from './index'

export default {
  getMessageReports: async (host: string) => {
    const authToken = JSON.parse(localStorage.getItem('kotoAuthToken')!)
    const config = {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    }

    return await axiosInstance.post(`${host}/rpc.MessageService/MessageReports`, {}, config).then(response => {
      return response
    }).catch(error => ({ error }))
  },
}