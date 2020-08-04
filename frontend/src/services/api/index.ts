import axios from 'axios'
import authorization from './authorization'
import registration from './registration'
import friends from './friends'
import nodes from './nodes'
import profile from './profile'
import messages from './messages'
import notifications from './notifications'

const URL = process.env.KOTO_CENTRAL_HOST ? `${process.env.KOTO_CENTRAL_HOST}:12001` : 'http://localhost:12001'

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
  nodes,
  profile,
  messages,
  notifications,
}
