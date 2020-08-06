
import { ApiTypes, CommonTypes } from '../../types'

export enum Types {
  NODE_CREATE_REQUEST = 'NODE_CREATE_REQUEST',
  NODE_CREATE_SUCCESS = 'NODE_CREATE_SUCCESS',
  NODE_CREATION_STATUS_RESET = 'NODE_CREATION_STATUS_RESET',

  GET_NODES_REQUEST = 'GET_NODES_REQUEST',
  GET_NODES_SUCCESS = 'GET_NODES_SUCCESS',

  APPROVE_NODE_REQUEST = 'APPROVE_NODE_REQUEST',
  REMOVE_NODE_REQUEST = 'REMOVE_NODE_REQUEST',
}

const nodeCreateRequest = (payload: ApiTypes.Nodes.Create) => ({
  type: Types.NODE_CREATE_REQUEST,
  payload
})

const nodeCreateSucces = () => ({
  type: Types.NODE_CREATE_SUCCESS
})

const nodeCreationStatusReset = () => ({
  type: Types.NODE_CREATION_STATUS_RESET
})

const getNodesRequest = () => ({
  type: Types.GET_NODES_REQUEST
})

const getNodesSuccess = (payload: CommonTypes.NodeTypes.Node[]) => ({
  type: Types.GET_NODES_SUCCESS,
  payload,
})

const approveNodeRequest = (payload: ApiTypes.Nodes.ApproveNode) => ({
  type: Types.APPROVE_NODE_REQUEST,
  payload,
})

const removeNodeRequest = (payload: ApiTypes.Nodes.RemoveNode) => ({
  type: Types.REMOVE_NODE_REQUEST,
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