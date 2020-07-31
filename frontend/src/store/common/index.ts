import { Types } from './actions'

export interface State {
  errorMessage: string
  successMessage: string
  isPreloaderActive: boolean
}

const initialState: State = {
  errorMessage: '',
  successMessage: '',
  isPreloaderActive: false,
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
    case Types.SET_PRELOADER_ACTIVE: {
      return {
        ...state, ...{
          isPreloaderActive: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
