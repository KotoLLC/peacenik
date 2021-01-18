import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { myGroupsFromBackToFront } from '@services/dataTransforms/myGroupsFromBackToFront'

export function* watchAddGroup(action: { type: string, payload: ApiTypes.Groups.AddGroup }) {
  const response = yield API.groups.addGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.addGroupSucces(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchEditGroup(action: { type: string, payload: ApiTypes.Groups.EditGroup }) {
  const response = yield API.groups.editGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.editGroupSuccess(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetMyGroups() {
  const response = yield API.profile.getProfile()

  if (response.status === 200) {
    yield put(Actions.groups.getMyGroupsSuccess(myGroupsFromBackToFront(response.data?.groups || [])))
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

export function* watchGetGroupDetails(action: { type: string, payload: string }) {
  const response = yield API.groups.getGroupDetails(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.getGroupDetailsSuccess(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDeleteGroup(action: { type: string, payload: string }) {
  const response = yield API.groups.deleteGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.deleteGroupSuccess(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}