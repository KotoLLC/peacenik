
import { ApiTypes } from 'src/types'

export enum Types {
  GET_NOTIFICATIONS_REQUEST = 'GET_NOTIFICATIONS_REQUEST',
  
  GET_NOTIFICATIONS_FROM_NODE_REQUEST = 'GET_NOTIFICATIONS_FROM_NODE_REQUEST',
  GET_NOTIFICATIONS_FROM_NODE_SUCCESS = 'GET_NOTIFICATIONS_FROM_NODE_SUCCESS',
  
  GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST = 'GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST',
  GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS = 'GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS',

  CLEAN_NOTIFICATIONS = 'CLEAN_NOTIFICATIONS',

  CLEAN_NOTIFICATIONS_IN_NODE_REQUEST = 'CLEAN_NOTIFICATIONS_IN_NODE_REQUEST',
  CLEAN_NOTIFICATIONS_IN_NODE_SUCCESS = 'CLEAN_NOTIFICATIONS_IN_NODE_SUCCESS',
  
  CLEAN_NOTIFICATIONS_IN_CENTRAL_REQUEST = 'CLEAN_NOTIFICATIONS_IN_CENTRAL_REQUEST',
  CLEAN_NOTIFICATIONS_IN_CENTRAL_SUCCESS = 'CLEAN_NOTIFICATIONS_IN_CENTRAL_SUCCESS',
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

const cleanNotificationsInCentralRequest = (payload: ApiTypes.Notifications.CleanNotification) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_CENTRAL_REQUEST,
  payload,
})

const cleanNotificationsInCentralSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_CENTRAL_SUCCESS,
})

const cleanNotificationsInNodeRequest = (payload: {
  host: string,
  data: ApiTypes.Notifications.CleanNotification
}) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_NODE_REQUEST,
  payload,
})

const cleanNotificationsInNodeSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_NODE_SUCCESS,
})

const cleanNotifications = () => ({
  type: Types.CLEAN_NOTIFICATIONS
})

export default {
  getNotificationsRequest,
  getNotificationsFromNodeRequest,
  getNotificationsFromNodeSuccess,
  getNotificationsFromCentralRequest,
  getNotificationsFromCentralSuccess,
  cleanNotificationsInCentralRequest,
  cleanNotificationsInCentralSuccess,
  cleanNotificationsInNodeRequest,
  cleanNotificationsInNodeSuccess,
  cleanNotifications,
}