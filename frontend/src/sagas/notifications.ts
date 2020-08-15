import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { messageHubsForMessagesBack2Front } from '@services/dataTransforms/messageHubsForMessagesTransform'
import { Types as NotificationsTypes } from '@store/notifications/actions'
import { CommonTypes } from 'src/types'

export function* watchGetNotifications() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    const messageTokens = messageHubsForMessagesBack2Front(response.data?.tokens)

    yield all(messageTokens.map(item => call(watchGetNotificationsFromMessageHub, {
      type: NotificationsTypes.GET_NOTIFICATIONS_FROM_MESSAGE_HUB_REQUEST,
      payload: item.host,
    })))
    yield call(watchGetNotificationsFromUserHub)
  } 
}

export function* watchGetNotificationsFromMessageHub(action: { type: string, payload: string }) {
  const response = yield API.notifications.getNotificationsFromMessageHub(action.payload)

  if (response.status === 200) {

    const notifications = response.data?.notifications || []

    if (notifications.length) {
      yield put(Actions.notifications.getNotificationsFromMessageHubSuccess(notifications))
      yield put(Actions.notifications.setLastKnownIdFromMessageHub({
        host: action.payload,
        id: notifications[notifications.length - 1].id
      })
      )
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
  } 
}

export function* watchCleanNotificationsInUserHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInUserHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInUserHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}

export function* watchCleanNotificationsInMessageHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInMessageHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInMessageHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}