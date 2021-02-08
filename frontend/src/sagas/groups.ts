import { put, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { myGroupsFromBackToFront } from '@services/dataTransforms/myGroupsFromBackToFront'
import selectors from '@selectors/index'
import { history } from '@view/routes'

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
    yield put(Actions.groups.getMyGroupsRequest())
    yield put(Actions.groups.getPublicGroupsRequest())
    yield put(Actions.common.setSuccessNotify('Saved successfully!'))
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

export function* watchRequestJoinGroup(action: { type: string, payload: ApiTypes.Groups.RequestJoin }) {
  const response = yield API.groups.requestJoinGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.joinToGroupSuccess(true))
    yield put(Actions.groups.getPublicGroupsRequest())
    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)
    yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))
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
    // yield put(Actions.groups.getInvitesToConfirmRequest())
    
    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)
    yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))

  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDenyInviteRequest(action: { type: string, payload: ApiTypes.Groups.ConfirmDenyInvite }) {
  const response = yield API.groups.denyInvite(action.payload)

  if (response.status === 200) {
    // yield put(Actions.groups.getInvitesToConfirmRequest())

    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)
    yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))

  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDeleteMemberRequest(action: { type: string, payload: ApiTypes.Groups.DeleteMember }) {
  const response = yield API.groups.deleteMember(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.deleteMemberSuccess(true))
    
    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)
    yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))

  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchLeaveGroupRequest(action: { type: string, payload: string }) {
  const response = yield API.groups.leaveGroup(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.leaveGroupSuccess(true))
    history.push('/groups')
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDeleteJoinRequest(action: { type: string, payload: ApiTypes.Groups.DeleteJoinRequest }) {
  const response = yield API.groups.deleteJoinRequest(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.deleteJoinSuccess(true))
    yield put(Actions.groups.getMyGroupsRequest())
    yield put(Actions.groups.getPublicGroupsRequest())

    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)

    if (currentGroupId) {
      yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))  
    }
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetGroupCoverUploadLink(action: { type: string, payload: ApiTypes.Groups.UploadLinkRequest }) {
  const response = yield API.groups.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.getCoverUploadLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchSetGroupCover(action: { type: string, payload: ApiTypes.Profile.Avatar }) {
  const response = yield API.groups.setGroupImage(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.groups.setCoverSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetGroupAvatarUploadLink(action: { type: string, payload: ApiTypes.Groups.UploadLinkRequest }) {
  const response = yield API.groups.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.groups.getAvatarUploadLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchSetGroupAvatar(action: { type: string, payload: ApiTypes.Profile.Avatar }) {
  const response = yield API.groups.setGroupImage(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.groups.setAvatarSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchAddUserToGroup(action: { type: string, payload: ApiTypes.Groups.AddUserToGroup }) {
  const response = yield API.groups.addUserToGroup(action.payload)

  if (response.status === 204 || response.status === 200) {
    const state = yield select()
    const currentGroupId = selectors.groups.currentGroupId(state)

    if (currentGroupId) {
      yield put(Actions.groups.getGroupDetailsRequest(currentGroupId))  
    }
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}