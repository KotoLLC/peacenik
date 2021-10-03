import axios from 'axios'
import authorization from './authorization'
import registration from './registration'
import friends from './friends'
import hubs from './hubs'
import profile from './profile'
import feed from './feed'
import messages from './messages'
import notifications from './notifications'
import dashboard from './dashboard'
import groups from './groups'
import common from './common'

// @ts-ignore
const URL: string = window.apiEndpoint
// const URL: string = "https://central.peacenik.app/"

export const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const axiosWithoutCredentials = axios.create({
  baseURL: URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const API = {
  registration,
  authorization,
  friends,
  hubs,
  profile,
  feed,
  messages,
  notifications,
  dashboard,
  groups,
  common,
}
