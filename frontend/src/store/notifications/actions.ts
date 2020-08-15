
import { CommonTypes } from 'src/types'

export enum Types {
  GET_NOTIFICATIONS_REQUEST = 'GET_NOTIFICATIONS_REQUEST',
  
  GET_NOTIFICATIONS_FROM_MESSAGE_HUB_REQUEST = 'GET_NOTIFICATIONS_FROM_MESSAGE_HUB_REQUEST',
  GET_NOTIFICATIONS_FROM_MESSAGE_HUB_SUCCESS = 'GET_NOTIFICATIONS_FROM_MESSAGE_HUB_SUCCESS',
  
  SET_LAST_KNOWN_ID_FROM_MESSAGE_HUB = 'SET_LAST_KNOWN_ID_FROM_MESSAGE_HUB',
  SET_LAST_KNOWN_ID_FROM_USER_HUB = 'SET_LAST_KNOWN_ID_FROM_USER_HUB',

  GET_NOTIFICATIONS_FROM_USER_HUB_REQUEST = 'GET_NOTIFICATIONS_FROM_USER_HUB_REQUEST',
  GET_NOTIFICATIONS_FROM_USER_HUB_SUCCESS = 'GET_NOTIFICATIONS_FROM_USER_HUB_SUCCESS',

  CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_REQUEST = 'CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_REQUEST',
  CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_SUCCESS = 'CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_SUCCESS',
  
  CLEAN_NOTIFICATIONS_IN_USER_HUB_REQUEST = 'CLEAN_NOTIFICATIONS_IN_USER_HUB_REQUEST',
  CLEAN_NOTIFICATIONS_IN_USER_HUB_SUCCESS = 'CLEAN_NOTIFICATIONS_IN_USER_HUB_SUCCESS',
}

const getNotificationsRequest = () => ({
  type: Types.GET_NOTIFICATIONS_REQUEST,
})

const getNotificationsFromMessageHubRequest = (payload: string) => ({
  type: Types.GET_NOTIFICATIONS_FROM_MESSAGE_HUB_REQUEST,
  payload
})

const getNotificationsFromMessageHubSuccess = (payload) => ({
  type: Types.GET_NOTIFICATIONS_FROM_MESSAGE_HUB_SUCCESS,
  payload,
})

const getNotificationsFromUserHubRequest = () => ({
  type: Types.GET_NOTIFICATIONS_FROM_USER_HUB_REQUEST,
})

const getNotificationsFromUserHubSuccess = (payload) => ({
  type: Types.GET_NOTIFICATIONS_FROM_USER_HUB_SUCCESS,
  payload,
})

const cleanNotificationsInUserHubRequest = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_USER_HUB_REQUEST,
  payload,
})

const cleanNotificationsInUserHubSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_USER_HUB_SUCCESS,
})

const cleanNotificationsInMessageHubRequest = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_REQUEST,
  payload,
})

const cleanNotificationsInMessageHubSuccess = () => ({
  type: Types.CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_SUCCESS,
})

const setLastKnownIdFromUserHub = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.SET_LAST_KNOWN_ID_FROM_USER_HUB,
  payload,
})
const setLastKnownIdFromMessageHub = (payload: CommonTypes.NotificationTypes.LastKnown) => ({
  type: Types.SET_LAST_KNOWN_ID_FROM_MESSAGE_HUB,
  payload,
})

export default {
  getNotificationsRequest,
  getNotificationsFromMessageHubRequest,
  getNotificationsFromMessageHubSuccess,
  getNotificationsFromUserHubRequest,
  getNotificationsFromUserHubSuccess,
  cleanNotificationsInUserHubRequest,
  cleanNotificationsInUserHubSuccess,
  cleanNotificationsInMessageHubRequest,
  cleanNotificationsInMessageHubSuccess,
  setLastKnownIdFromUserHub,
  setLastKnownIdFromMessageHub,
}