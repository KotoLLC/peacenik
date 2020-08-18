import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { ApiTypes } from 'src/types'
import { API } from '@services/api'
import { hubsListBack2Front } from '@services/dataTransforms/hubsListTransform'

export function* watchHubCreate(action: { type: string, payload: ApiTypes.Hubs.Create }) {
  const response = yield API.hubs.createHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.hubs.hubCreateSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetHubs() {
  const response = yield API.hubs.getHubs()

  if (response.status === 200) {
    yield put(Actions.hubs.getHubsSuccess(hubsListBack2Front(response?.data?.hubs)))
  } 
}

export function* watchApproveHub(action: {type: string, payload: ApiTypes.Hubs.ApproveHub}) {
  const response = yield API.hubs.approveHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.hubs.getHubsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchRemoveHub(action: {type: string, payload: ApiTypes.Hubs.RemoveHub}) {
  const response = yield API.hubs.removeHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.hubs.getHubsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}