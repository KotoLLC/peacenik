import { put, all, call, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { usersInviteStatusFromBackToFront } from '@services/dataTransforms/usersInviteStatusFromBackToFront'
import selectors from '@selectors/index'

export function* watchGetProfile() {
  
  try {
    const response = yield API.profile.getProfile()

    if (response.status === 200 && response.data) {
      if (response.data?.user?.is_confirmed) {
        yield put(Actions.authorization.getAuthTokenRequest())
      }
  
      yield put(Actions.profile.getProfileSucces(response.data))
      const user = Object.assign({}, response.data.user)
      delete user.email
      localStorage.setItem('peacenikProfile', JSON.stringify({user}))
    } else if (response.error.response.status === 401) {
      localStorage.clear()
      window.location.reload()
    }
    
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}

export function* watchGetUploadLink(action: { type: string, payload: ApiTypes.UploadLinkRequest }) {
  const response = yield API.profile.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getUploadLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchSetAvatar(action: { type: string, payload: ApiTypes.Profile.Avatar }) {
  const response = yield API.profile.setAvatar(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.profile.setAvatarSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchEditProfile(action: { type: string, payload: ApiTypes.Profile.EditProfile }) {
  const response = yield API.profile.editProfile(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getProfileRequest())
    yield put(Actions.profile.resetProfileErrorMessage())
    yield put(Actions.profile.editProfileSuccess(true))
    yield put(Actions.common.setSuccessNotify('Changes have been saved'))
    setTimeout(() => window.location.reload(), 1500)
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.profile.editProfileFailed(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetUsers(action: { type: string, payload: string[] }) {
  const response = yield API.profile.getUsers(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getUsersSucces(
      usersInviteStatusFromBackToFront(response.data?.users, response.data?.invite_statuses)
    ))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchDisableUser(action: { type: string, payload: string }) {
  const response = yield API.profile.disableUser(action.payload)

  if (response.status === 200) {
    yield put(Actions.authorization.getAuthTokenRequest())
    yield put(Actions.feed.cleanAllFeeds())
    yield put(Actions.feed.getFeedTokensRequest())
    yield put(Actions.friends.getFriendsRequest())
    yield put(Actions.common.setSuccessNotify('Blocked successfuly'))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetProfileCoverUploadLink(action: { type: string, payload: ApiTypes.UploadLinkRequest }) {
  const response = yield API.common.getUploadLink(action.payload)

  if (response.status === 200) {
    yield put(Actions.profile.getProfileCoverLinkSucces(response.data))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchSetProfileCover(action: { type: string, payload: ApiTypes.Attachment }) {
  const response = yield API.common.setAttachment(action.payload.link, action.payload.form_data)

  if (response.status === 204 || response.status === 200) {
    yield put(Actions.profile.setProfileCoverSuccess())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function * watchDeleteAccount( action: {type: string}) {
  try {
    let response = yield API.profile.deleteAccountFromUserHub()
    if ( response.status === 200) {
      const state = yield select()
      const feedsTokens = selectors.feed.feedsTokens(state)
      yield all(feedsTokens.map(item => {             
        return call(API.profile.deleteAccountFromMsgHub, item.host)
      }))
      yield put(Actions.profile.deleteAccountSuccess())
    } else {
      yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
    }
  } catch (error) {
    if (!error.response) {
      yield put(Actions.common.setConnectionError(true))
    }
  }
}