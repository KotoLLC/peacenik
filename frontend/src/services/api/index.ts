import axios from 'axios'
import authorization from './authorization'
import registration from './registration'
import friends from './friends'
import messageHubs from './message-hubs'
import profile from './profile'
import messages from './messages'
import notifications from './notifications'

// @ts-ignore
const URL: string = window.apiEndpoint

export const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const API = {
  registration,
  authorization,
  friends,
  messageHubs,
  profile,
  messages,
  notifications,
}
