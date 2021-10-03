import { put, all, call } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { hubsForMessagesBack2Front } from '@services/dataTransforms/hubsForMessagesTransform'
import { Types as NotificationsTypes } from '@store/notifications/actions'
import { CommonTypes } from 'src/types'
import { store } from '@store/store'
// import { FormatColorResetOutlined } from '@material-ui/icons'

export function* watchGetNotifications() {
  const response = yield API.feed.getMessages()

  if (response.status === 200) {
    const feedsTokens = hubsForMessagesBack2Front(response.data?.tokens)

    yield all(feedsTokens.map(item => call(watchGetNotificationsFromHub, {
      type: NotificationsTypes.GET_NOTIFICATIONS_FROM_HUB_REQUEST,
      payload: item,
    })))
    yield call(watchGetNotificationsFromUserHub)
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  }
}

export function* watchGetNotificationsFromHub(action: { type: string, payload: CommonTypes.HubTypes.CurrentHub }) {

  try {
    
    const res = yield API.feed.getMessages()

    if (res.status === 200) {
      const feedsTokens = hubsForMessagesBack2Front(res.data?.tokens)
      yield put(Actions.feed.getFeedTokensSuccess(feedsTokens))
    }

    const response = yield API.notifications.getNotificationsFromHub(action.payload.host)

    if (response.status === 200) {
      const notifications = response.data?.notifications || []

      let currentHub = store.getState().feed.currentHub.host
      
      if ( currentHub === action.payload.host) {
        yield put(Actions.common.setConnectionError(false))
      }

      if (notifications.length) {
        let resultData = []
        if (notifications.length) {
          resultData = response.data?.notifications.map(item => {
            item.sourceHost = action.payload.host
            item.messageToken = action.payload.token
            return item
          })
        }
        yield put(Actions.notifications.getNotificationsFromHubSuccess(resultData))
        yield put(Actions.notifications.setLastKnownIdFromMessageHub({
          host: action.payload.host,
          id: notifications[notifications.length - 1].id
        })
        )
      }
    } else {
      if (response.error.response.status === 400) {
        yield put(Actions.authorization.getAuthTokenRequest())
      }
    }

  } catch (error) {
    if (!error.response) {
      let currentHub = store.getState().feed.currentHub.host
      
      if ( currentHub === action.payload.host) {
        yield put(Actions.common.setConnectionError(true))
      }
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
    localStorage.clear()
    window.location.reload()
  }
}

export function* watchCleanNotificationsInUserHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.cleanNotificationsInUserHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.cleanNotificationsInUserHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  } else if (response.error.response.status === 401) {
    localStorage.clear()
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

export function* watchMarkAsReadNotificationsInUserHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.markAsReadNotificationsInUserHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.markAsReadNotificationsInHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  } else if (response.error.response.status === 401) {
    localStorage.clear()
    window.location.reload()
  }
}

export function* watchMarkAsReadNotificationsInHub(action: { type: string, payload: CommonTypes.NotificationTypes.LastKnown }) {
  const response = yield API.notifications.markAsReadNotificationsInHub(action.payload)

  if (response.status === 200) {
    yield put(Actions.notifications.markAsReadNotificationsInHubSuccess())
    yield put(Actions.notifications.getNotificationsRequest())
  }
}
