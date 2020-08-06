import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { nodesForMessagesBack2Front } from '@services/dataTransforms/nodesForMessagesTransform'
import { Types as NotificationsTypes } from '@store/notifications/actions'
import { CommonTypes } from 'src/types'

export function* watchGetNotifications() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    const messageTokens = nodesForMessagesBack2Front(response.data?.tokens)

    yield all(messageTokens.map(item => call(watchGetNotificationsFromNode, {
      type: NotificationsTypes.GET_NOTIFICATIONS_FROM_NODE_REQUEST,
      payload: item.host,
    })))
    yield call(watchGetNotificationsFromCentral)
  } 
}

export function* watchGetNotificationsFromNode(action: { type: string, payload: string }) {
  const response = yield API.notifications.getNotificationsFromNode(action.payload)

  if (response.status === 200) {

    const notifications = response.data?.notifications || []

    if (notifications.length) {
      yield put(Actions.notifications.getNotificationsFromNodeSuccess(notifications))
      yield put(Actions.notifications.setLastKnownIdFromNode({
        host: action.payload,
        id: notifications[notifications.length - 1].id
      })
      )
    }
  }
}

export function* watchGetNotificationsFromCentral() {
  const response = yield API.notifications.getNotificationsFromCentral()

  if (response.status === 200) {
    const notifications = response.data?.notifications || []

    if (notifications.length) {
      yield put(Actions.notifications.getNotificationsFromCentralSuccess(notifications))
      yield put(Actions.notifications.setLastKnownIdFromCentral({
        id: notifications[notifications.length - 1].id
      })
      )
    }
  } 
}

export function* watchCleanNotificationsInCentral(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInCentral(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInCentralSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}

export function* watchCleanNotificationsInNode(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInNodeSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}