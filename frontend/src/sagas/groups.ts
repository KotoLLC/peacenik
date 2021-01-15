import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'

export function* watchAddGroup(action: { type: string, payload: ApiTypes.Groups.AddGroup }) {
  const response = yield API.groups.addGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.addGroupSucces(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetMyGroups() {
  const response = yield API.groups.getMyGroups()

  if (response.status === 200) {
    yield put(Actions.groups.getMyGroupsSuccess(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetPublicGroups() {
  const response = yield API.groups.getPublicGroups()

  if (response.status === 200) {
    yield put(Actions.groups.getPublicGroupsSuccess(response.data?.groups || []))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}