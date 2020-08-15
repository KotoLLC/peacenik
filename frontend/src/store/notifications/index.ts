import { Types } from './actions'
import uniqBy from 'lodash.uniqby'
import { ApiTypes, CommonTypes } from 'src/types'

export interface State {
  notifications: ApiTypes.Notifications.Notification[],
  lastKnownIdFromMessageHubs: CommonTypes.NotificationTypes.LastKnown[]
  lastKnownIdFromUserHub: CommonTypes.NotificationTypes.LastKnown | null
}

const initialState: State = {
  notifications: [],
  lastKnownIdFromMessageHubs: [],
  lastKnownIdFromUserHub: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_NOTIFICATIONS_FROM_MESSAGE_HUB_SUCCESS: {
      return {
        ...state, ...{
          notifications: uniqBy([...action.payload, ...state.notifications], 'id'),
        }
      }
    }
    case Types.GET_NOTIFICATIONS_FROM_USER_HUB_SUCCESS: {
      return {
        ...state, ...{
          notifications: uniqBy([...action.payload, ...state.notifications], 'id')
        }
      }
    }
    case Types.SET_LAST_KNOWN_ID_FROM_USER_HUB: {
      return {
        ...state, ...{
          lastKnownIdFromUserHub: action.payload
        }
      }
    }
    case Types.SET_LAST_KNOWN_ID_FROM_MESSAGE_HUB: {
      return {
        ...state, ...{
          lastKnownIdFromMessageHubs: [
            ...state.lastKnownIdFromMessageHubs.filter(item => item.host !== action.payload.host),
            ...[action.payload]
          ]
        }
      }
    }
    case Types.CLEAN_NOTIFICATIONS_IN_USER_HUB_SUCCESS: {
      return {
        ...state, ...{
          notifications: []
        }
      }
    }
    case Types.CLEAN_NOTIFICATIONS_IN_MESSAGE_HUB_SUCCESS: {
      return {
        ...state, ...{
          notifications: []
        }
      }
    }
    default: return state
  }
}

export default reducer
