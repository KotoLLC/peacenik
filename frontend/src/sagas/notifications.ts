import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { nodesForMessagesBack2Front } from '@services/dataTransforms/nodesForMessagesTransform'
import { Types as NotificationsTypes } from '@store/notifications/actions'

export function* watchGetNotifications() {
  const response = yield API.messages.getMessages()

  if (response.status === 200) {
    const messageTokens = nodesForMessagesBack2Front(response.data?.tokens)

    yield all(messageTokens.map(item => call(watchGetNotificationsFromNode, {
      type: NotificationsTypes.GET_NOTIFICATIONS_FROM_NODE_REQUEST,
      payload: item.host,
    })))

    yield call(watchGetNotificationsFromCentral)

  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetNotificationsFromNode(action: { type: string, payload: string }) {
  const response = yield API.notifications.getNotificationsFromNode(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.getNotificationsFromNodeSuccess(response.data?.notifications || []))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}

export function* watchGetNotificationsFromCentral() {
  const response = yield API.notifications.getNotificationsFromCentral()

  if (response.status === 200) {
    yield put(Actions.notifications.getNotificationsFromCentralSuccess(response.data?.notifications || []))
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}
