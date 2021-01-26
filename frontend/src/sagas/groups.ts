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

export function* watchRequestJounGroup(action: { type: string, payload: ApiTypes.Groups.RequestJoin }) {
  const response = yield API.groups.requestJoinGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.joinToGroupSuccess(true))
    yield put(Actions.groups.getPublicGroupsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetInvitesToConfirmRequest() {
  const response = yield API.groups.getInvitesToConfirm()

  if (response.status === 200) {
    yield put(Actions.groups.getInvitesToConfirmSuccess(response.data?.groups))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchConfirmInviteRequest(action: { type: string, payload: ApiTypes.Groups.ConfirmDenyInvite }) {
  const response = yield API.groups.сonfirmInvite(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.getInvitesToConfirmRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDenyInviteRequest(action: { type: string, payload: ApiTypes.Groups.ConfirmDenyInvite }) {
  const response = yield API.groups.denyInvite(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.getInvitesToConfirmRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDeleteMemberRequest(action: { type: string, payload: ApiTypes.Groups.DeleteMember }) {
  const response = yield API.groups.deleteMember(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.deleteMemberSuccess(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchLeaveGroupRequest(action: { type: string, payload: string }) {
  const response = yield API.groups.leaveGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.leaveGroupSuccess(true))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}