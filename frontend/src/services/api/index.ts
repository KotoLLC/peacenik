import axios from 'axios'
import authorization from './authorization'
import registration from './registration'
import friends from './friends'
import nodes from './nodes'
import profile from './profile'
import messages from './messages'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:12001',
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
}
