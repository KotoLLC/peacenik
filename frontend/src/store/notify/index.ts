import { Types } from './actions'

export interface State {
  errorMessage: string,
  successMessage: string,
}

const initialState: State = {
  errorMessage: '',
  successMessage: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_ERROR_NOTIFY: {
      return {
        ...state, ...{
          errorMessage: action.payload,
        }
      }
    }
    case Types.SET_SUCCESS_NOTIFY: {
      return {
        ...state, ...{
          successMessage: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
