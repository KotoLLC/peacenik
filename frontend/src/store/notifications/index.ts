import { Types } from './actions'
import uniqBy from 'lodash.uniqby'
import { ApiTypes, CommonTypes } from 'src/types'

export interface State {
  notifications: ApiTypes.Notifications.Notification[],
  lastKnownIdFromNodes: CommonTypes.NotificationTypes.LastKnown[]
  lastKnownIdFromCentral: CommonTypes.NotificationTypes.LastKnown | null
}

const initialState: State = {
  notifications: [],
  lastKnownIdFromNodes: [],
  lastKnownIdFromCentral: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_NOTIFICATIONS_FROM_NODE_SUCCESS: {
      return {
        ...state, ...{
          notifications: uniqBy([...action.payload, ...state.notifications], 'id'),
        }
      }
    }
    case Types.GET_NOTIFICATIONS_FROM_CENTRAL_SUCCESS: {
      return {
        ...state, ...{
          notifications: uniqBy([...action.payload, ...state.notifications], 'id')
        }
      }
    }
    case Types.SET_LAST_KNOWN_ID_FROM_CENTRAL: {
      return {
        ...state, ...{
          lastKnownIdFromCentral: action.payload
        }
      }
    }
    case Types.SET_LAST_KNOWN_ID_FROM_NODE: {
      return {
        ...state, ...{
          lastKnownIdFromNodes: [
            ...state.lastKnownIdFromNodes.filter(item => item.host !== action.payload.host),
            ...[action.payload]
          ]
        }
      }
    }
    case Types.CLEAN_NOTIFICATIONS_IN_CENTRAL_SUCCESS: {
      return {
        ...state, ...{
          notifications: []
        }
      }
    }
    case Types.CLEAN_NOTIFICATIONS_IN_NODE_SUCCESS: {
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
