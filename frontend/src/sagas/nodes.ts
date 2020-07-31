import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { ApiTypes } from '../types/index'
import { API } from '@services/api'
import { nodesListBack2Front } from '@services/dataTransforms/nodesListTransform'

export function* watchNodeCreate(action: { type: string, payload: ApiTypes.Nodes.Create }) {
  const response = yield API.nodes.createNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.nodeCreateSucces())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetNodes() {
  const response = yield API.nodes.getNodes()

  if (response.status === 200) {
    yield put(Actions.nodes.getNodesSuccess(nodesListBack2Front(response?.data?.nodes)))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchApproveNode(action: {type: string, payload: ApiTypes.Nodes.ApproveNode}) {
  const response = yield API.nodes.approveNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.getNodesRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchRemoveNode(action: {type: string, payload: ApiTypes.Nodes.RemoveNode}) {
  const response = yield API.nodes.removeNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.nodes.getNodesRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}