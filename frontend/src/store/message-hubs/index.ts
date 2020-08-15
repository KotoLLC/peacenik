import { Types } from './actions'
import { CommonTypes } from 'src/types'

export interface State {
  isHubCreatedSuccessfully: boolean,
  hubsList: CommonTypes.MessageHubTypes.Hub[]
}

const initialState: State = {
  isHubCreatedSuccessfully: false,
  hubsList: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.MESSAGE_HUB_CREATE_SUCCESS: {
      return {
        ...state, ...{
          isHubCreatedSuccessfully: true,
        }
      }
    }
    case Types.MESSAGE_HUB_CREATION_STATUS_RESET: {
      return {
        ...state, ...{
          isHubCreatedSuccessfully: false,
        }
      }
    }
    case Types.GET_MESSAGE_HUBS_SUCCESS: {
      return {
        ...state, ...{
          hubsList: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
