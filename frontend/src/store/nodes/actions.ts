
import { ApiTypes } from '../../types'

export enum Types {
  NODE_CREATE_REQUEST = 'NODE_CREATE_REQUEST',
  NODE_CREATE_SUCCESS = 'NODE_CREATE_SUCCESS',
  NODE_CREATION_STATUS_RESET = 'NODE_CREATION_STATUS_RESET',
}

export const nodeCreateRequest = (payload: ApiTypes.Nodes.Create) => ({
  type: Types.NODE_CREATE_REQUEST,
  payload
})

export const nodeCreateSucces = () => ({
  type: Types.NODE_CREATE_SUCCESS
})

export const nodeCreationStatusReset = () => ({
  type: Types.NODE_CREATION_STATUS_RESET
})

export default {
  nodeCreateRequest,
  nodeCreateSucces,
  nodeCreationStatusReset,
}