import axios from 'axios'
import authorization from './authorization'
import registration from './registration'
import friends from './friends'
import hubs from './hubs'
import profile from './profile'
import feed from './feed'
import notifications from './notifications'
import dashboard from './dashboard'
import groups from './groups'
import common from './common'

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
  hubs,
  profile,
  feed,
  notifications,
  dashboard,
  groups,
  common,
}
