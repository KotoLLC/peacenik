
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  GET_NOTIFICATIONS_REQUEST = 'GET_NOTIFICATIONS_REQUEST',
  
  GET_NOTIFICATIONS_FROM_NODE_REQUEST = 'GET_NOTIFICATIONS_FROM_NODE_REQUEST',
  GET_NOTIFICATIONS_FROM_NODE_SUCCESS = 'GET_NOTIFICATIONS_FROM_NODE_SUCCESS',
  
  SET_LAST_KNOWN_ID_FROM_NODE = 'SET_LAST_KNOWN_ID_FROM_NODE',
  SET_LAST_KNOWN_ID_FROM_CENTRAL = 'SET_LAST_KNOWN_ID_FROM_CENTRAL',

  GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST = 'GET_NOTIFICATIONS_FROM_CENTRAL_REQUEST',
  GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS = 'GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS',

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

const cleanNotificationsInCentralRequest = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_CENTRAL_REQUEST,
  payload,
})

const cleanNotificationsInCentralSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_CENTRAL_SUCCESS,
})

const cleanNotificationsInNodeRequest = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_NODE_REQUEST,
  payload,
})

const cleanNotificationsInNodeSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_NODE_SUCCESS,
})

const setLastKnownIdFromCentral = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.SET_LAST_KNOWN_ID_FROM_CENTRAL,
  payload,
})
const setLastKnownIdFromNode = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.SET_LAST_KNOWN_ID_FROM_NODE,
  payload,
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
  setLastKnownIdFromCentral,
  setLastKnownIdFromNode,
}