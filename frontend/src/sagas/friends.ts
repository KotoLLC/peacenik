import { put } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { setUserNames } from '@services/userNames'

export function* watchGetFriends() { 

  try {
    const response = yield API.friends.getFriends()

    if (response.status === 200) {
      yield put(Actions.friends.getFriendsSucces(response.data.friends || []))
      setUserNames(response.data.friends)
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

export function* watchGetFriendsOfFriends() {

  try {
    // console.log("send")
    const response = yield API.friends.getFriendsOfFriends()

    if (response.status === 200) {
      // console.log("success", response.data.friends)
      yield put(Actions.friends.getFriendsOfFriendsSucces(response.data.friends || []))
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

export function* watchAddFriend(action: { type: string, payload: ApiTypes.Friends.Request }) {
  const response = yield API.friends.addFriend(action.payload)

  if (response.status === 200) {
    yield put(Actions.friends.addFriendSuccess())
    yield put(Actions.friends.getFriendsRequest())
    yield put(Actions.friends.getInvitationsRequest())
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetInvitations() {
  
  try {
    const response = yield API.friends.getInvitations()

    if (response.status === 200) {
      yield put(Actions.friends.getInvitationsSuccess(response.data.invites))
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

export function* watchAcceptInvitation(action: { type: string, payload: ApiTypes.Friends.InvitationAccept }) {
  const response = yield API.friends.acceptInvitation(action.payload)

  if (response.status === 200) {
    yield put(Actions.friends.getFriendsRequest())
    yield put(Actions.friends.getInvitationsRequest())
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchRejectInvitation(action: { type: string, payload: ApiTypes.Friends.InvitationReject }) {
  const response = yield API.friends.rejectInvitation(action.payload)

  if (response.status === 200) {
    yield put(Actions.friends.getInvitationsRequest())
    yield put(Actions.friends.getFriendsRequest())
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchCreateInviteByEmail(action: { type: string, payload: ApiTypes.Friends.Request }) {
  const response = yield API.friends.addFriend(action.payload)

  if (response.status === 200) {
    yield put(Actions.friends.inviteByEmailSuccess(true))
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}