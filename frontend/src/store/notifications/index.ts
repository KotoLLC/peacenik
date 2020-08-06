import { Types } from './actions'
import uniqBy from 'lodash.uniqby'
import { ApiTypes } from 'src/types'

export interface State {
  notifications: ApiTypes.Notifications.Notification[],
}

const initialState: State = {
  notifications: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_NOTIFICATIONS_FROM_NODE_SUCCESS: {
      return {
        ...state, ...{
          notifications: uniqBy([...action.payload, ...state.notifications], 'id')
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
    default: return state
  }
}

export default reducer
