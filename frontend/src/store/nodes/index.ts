import { Types } from './actions'

export interface State {
  isNodeCreatedSuccessfully: boolean,
}

const initialState: State = {
  isNodeCreatedSuccessfully: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.NODE_CREATE_SUCCESS: {
      return {
        ...state, ...{
          isNodeCreatedSuccessfully: true,
        }
      }
    }
    case Types.NODE_CREATION_STATUS_RESET: {
      return {
        ...state, ...{
          isNodeCreatedSuccessfully: false,
        }
      }
    }
    default: return state
  }
}

export default reducer
