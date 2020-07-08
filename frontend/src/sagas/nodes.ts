import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { Types as NodeTypes } from '@store/nodes/actions'
import { ApiTypes } from '../types/index'
import { API } from '@services/api'

export function* watchNodeCreate(action: { type: NodeTypes.NODE_CREATE_REQUEST, payload: ApiTypes.Nodes.Create }) {
  const response = yield API.nodes.createNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.nodeCreateSucces())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetNodes() {
  const response = yield API.nodes.getNodes()

  if (response.status === 200) {
    // yield put(Actions.nodes.getNodesSuccess(response.data))
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchApproveNode(action: {type: NodeTypes.APPROVE_NODE_REQUEST, payload: ApiTypes.Nodes.ApproveNode}) {
  const response = yield API.nodes.approveNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.getNodesRequest())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchRemoveNode(action: {type: NodeTypes.REMOVE_NODE_REQUEST, payload: ApiTypes.Nodes.RemoveNode}) {
  const response = yield API.nodes.removeNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.getNodesRequest())
  } else {
    yield put(Actions.notify.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}