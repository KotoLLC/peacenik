
import { ApiTypes, NodeTypes } from '../../types'

export enum Types {
  GET_NOTIFICATIONS_REQUEST = 'GET_NOTIFICATIONS_REQUEST',
  
  GET_NOTIFICATIONS_FROM_NODE_REQUEST = 'GET_NOTIFICATIONS_FROM_NODE_REQUEST',
  GET_NOTIFICATIONS_FROM_NODE_SUCCESS = 'GET_NOTIFICATIONS_FROM_NODE_SUCCESS',
  
  GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST = 'GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST',
  GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS = 'GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS',
}

const getNotificationsRequest = () => ({
  type: Types.GET_NOTIFICATIONS_REQUEST,
})

const getNotificationsFromNodeRequest = (payload: string) => ({
  type: Types.GET_NOTIFICATIONS_FROM_NODE_REQUEST,
  payload
})

const getNotificationsFromNodeSuccess = (payload) => ({
  type: Types.GET_NOTIFICATIONS_FROM_NODE_SUCCESS,
  payload,
})

const getNotificationsFromCentralRequest = () => ({
  type: Types.GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST,
})

const getNotificationsFromCentralSuccess = (payload) => ({
  type: Types.GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS,
  payload,
})

export default {
  getNotificationsRequest,
  getNotificationsFromNodeRequest,
  getNotificationsFromNodeSuccess,
  getNotificationsFromCentralRequest,
  getNotificationsFromCentralSuccess,
}