
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  MESSAGE_HUB_CREATE_REQUEST = 'MESSAGE_HUB_CREATE_REQUEST',
  MESSAGE_HUB_CREATE_SUCCESS = 'MESSAGE_HUB_CREATE_SUCCESS',
  MESSAGE_HUB_CREATION_STATUS_RESET = 'MESSAGE_HUB_CREATION_STATUS_RESET',

  GET_MESSAGE_HUBS_REQUEST = 'GET_MESSAGE_HUBS_REQUEST',
  GET_MESSAGE_HUBS_SUCCESS = 'GET_MESSAGE_HUBS_SUCCESS',

  APPROVE_MESSAGE_HUB_REQUEST = 'APPROVE_MESSAGE_HUB_REQUEST',
  REMOVE_MESSAGE_HUB_REQUEST = 'REMOVE_MESSAGE_HUB_REQUEST',
}

const hubCreateRequest = (payload: ApiTypes.MessageHubs.Create) => ({
  type: Types.MESSAGE_HUB_CREATE_REQUEST,
  payload
})

const hubCreateSuccess = () => ({
  type: Types.MESSAGE_HUB_CREATE_SUCCESS
})

const hubCreationStatusReset = () => ({
  type: Types.MESSAGE_HUB_CREATION_STATUS_RESET
})

const getHubsRequest = () => ({
  type: Types.GET_MESSAGE_HUBS_REQUEST
})

const getHubsSuccess = (payload: CommonTypes.MessageHubTypes.Hub[]) => ({
  type: Types.GET_MESSAGE_HUBS_SUCCESS,
  payload,
})

const approveHubRequest = (payload: ApiTypes.MessageHubs.ApproveHub) => ({
  type: Types.APPROVE_MESSAGE_HUB_REQUEST,
  payload,
})

const removeHubRequest = (payload: ApiTypes.MessageHubs.RemoveHub) => ({
  type: Types.REMOVE_MESSAGE_HUB_REQUEST,
  payload,
})

export default {
  hubCreateRequest,
  hubCreateSuccess,
  hubCreationStatusReset,
  getHubsRequest,
  getHubsSuccess,
  approveHubRequest,
  removeHubRequest,
}