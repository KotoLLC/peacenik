import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import { Types as NotificationsTypes } from '@store/notifications/actions'
import { CommonTypes } from 'src/types'

export function* watchGetNotifications() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    const messageTokens = hubsForMessagesBack2Front(response.data?.tokens)

    yield all(messageTokens.map(item => call(watchGetNotificationsFromHub, {
      type: NotificationsTypes.GET_NOTIFICATIONS_FROM_HUB_REQUEST,
      payload: item.host,
    })))
    yield call(watchGetNotificationsFromUserHub)
  } else if (response.error.response.status === 401) {
    sessionStorage.clear()
    window.location.reload()
  }
}

export function* watchGetNotificationsFromHub(action: { type: string, payload: string }) {
  const response = yield API.notifications.getNotificationsFromHub(action.payload)

  if (response.status === 200) {
    const notifications = response.data?.notifications || []

    if (notifications.length) {
      yield put(Actions.notifications.getNotificationsFromHubSuccess(notifications))
      yield put(Actions.notifications.setLastKnownIdFromMessageHub({
        host: action.payload,
        id: notifications[notifications.length - 1].id
      })
      )
    }
  } else {
    if (response.error.response.status === 400) {
      yield put(Actions.authorization.getAuthTokenRequest())
    }
  }
}

export function* watchGetNotificationsFromUserHub() {
  const response = yield API.notifications.getNotificationsFromUserHub()

  if (response.status === 200) {
    const notifications = response.data?.notifications || []

    if (notifications.length) {
      yield put(Actions.notifications.getNotificationsFromUserHubSuccess(notifications))
      yield put(Actions.notifications.setLastKnownIdFromUserHub({
        id: notifications[notifications.length - 1].id
      })
      )
    }
  } else if (response.error.response.status === 401) {
    sessionStorage.clear()
    window.location.reload()
  }
}

export function* watchCleanNotificationsInUserHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInUserHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInUserHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  } else if (response.error.response.status === 401) {
    sessionStorage.clear()
    window.location.reload()
  }
}

export function* watchCleanNotificationsInHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}