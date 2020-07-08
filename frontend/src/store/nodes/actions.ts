
import { ApiTypes } from '../../types'

export enum Types {
  NODE_CREATE_REQUEST = 'NODE_CREATE_REQUEST',
  NODE_CREATE_SUCCESS = 'NODE_CREATE_SUCCESS',
  NODE_CREATION_STATUS_RESET = 'NODE_CREATION_STATUS_RESET',

  GET_NODES_REQUEST = 'GET_NODES_REQUEST',
  GET_NODES_SUCCESS = 'GET_NODES_SUCCESS',

  APPROVE_NODE_REQUEST = 'APPROVE_NODE_REQUEST',
  REMOVE_NODE_REQUEST = 'REMOVE_NODE_REQUEST',
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

export const getNodesRequest = () => ({
  type: Types.GET_NODES_REQUEST
})

export const getNodesSuccess = (payload) => ({
  type: Types.GET_NODES_SUCCESS,
  payload,
})

export const approveNodeRequest = (payload: ApiTypes.Nodes.ApproveNode) => ({
  type: Types.APPROVE_NODE_REQUEST,
  payload,
})

export const removeNodeRequest = (payload: ApiTypes.Nodes.RemoveNode) => ({
  type: Types.APPROVE_NODE_REQUEST,
  payload,
})

export default {
  nodeCreateRequest,
  nodeCreateSucces,
  nodeCreationStatusReset,
  getNodesRequest,
  getNodesSuccess,
  approveNodeRequest,
  removeNodeRequest,
}