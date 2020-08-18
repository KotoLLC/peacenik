
import { ApiTypes, CommonTypes } from 'src/types'

export enum Types {
  HUB_CREATE_REQUEST = 'HUB_CREATE_REQUEST',
  HUB_CREATE_SUCCESS = 'HUB_CREATE_SUCCESS',
  HUB_CREATION_STATUS_RESET = 'HUB_CREATION_STATUS_RESET',

  GET_HUBS_REQUEST = 'GET_HUBS_REQUEST',
  GET_HUBS_SUCCESS = 'GET_HUBS_SUCCESS',

  APPROVE_HUB_REQUEST = 'APPROVE_HUB_REQUEST',
  REMOVE_HUB_REQUEST = 'REMOVE_HUB_REQUEST',
}

const hubCreateRequest = (payload: ApiTypes.Hubs.Create) => ({
  type: Types.HUB_CREATE_REQUEST,
  payload
})

const hubCreateSuccess = () => ({
  type: Types.HUB_CREATE_SUCCESS
})

const hubCreationStatusReset = () => ({
  type: Types.HUB_CREATION_STATUS_RESET
})

const getHubsRequest = () => ({
  type: Types.GET_HUBS_REQUEST
})

const getHubsSuccess = (payload: CommonTypes.HubTypes.Hub[]) => ({
  type: Types.GET_HUBS_SUCCESS,
  payload,
})

const approveHubRequest = (payload: ApiTypes.Hubs.ApproveHub) => ({
  type: Types.APPROVE_HUB_REQUEST,
  payload,
})

const removeHubRequest = (payload: ApiTypes.Hubs.RemoveHub) => ({
  type: Types.REMOVE_HUB_REQUEST,
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