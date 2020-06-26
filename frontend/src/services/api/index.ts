import axios from 'axios'
import authorization from './authorization'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:12001'
})

export const API = {
  authorization,
}
