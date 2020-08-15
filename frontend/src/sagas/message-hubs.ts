import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { ApiTypes } from 'src/types'
import { API } from '@services/api'
import { messageHubsListBack2Front } from '@services/dataTransforms/messageHubsListTransform'

export function* watchMessageHubCreate(action: { type: string, payload: ApiTypes.MessageHubs.Create }) {
  const response = yield API.messageHubs.createHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.messageHubs.hubCreateSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetHubs() {
  const response = yield API.messageHubs.getHubs()

  if (response.status === 200) {
    yield put(Actions.messageHubs.getHubsSuccess(messageHubsListBack2Front(response?.data?.hubs)))
  } 
}

export function* watchApproveHub(action: {type: string, payload: ApiTypes.MessageHubs.ApproveHub}) {
  const response = yield API.messageHubs.approveHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.messageHubs.getHubsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchRemoveHub(action: {type: string, payload: ApiTypes.MessageHubs.RemoveHub}) {
  const response = yield API.messageHubs.removeHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.messageHubs.getHubsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}