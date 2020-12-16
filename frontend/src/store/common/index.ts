import { Types } from './actions'

export interface State {
  errorMessage: string
  successMessage: string
  isAboutUsViewed: boolean
  isConnectionError: boolean
}

const kotoIsAboutUsViewed = localStorage.getItem('kotoIsAboutUsViewed')

const initialState: State = {
  errorMessage: '',
  successMessage: '',
  isAboutUsViewed: (kotoIsAboutUsViewed) ? JSON.parse(kotoIsAboutUsViewed) : false,
  isConnectionError: false,
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
    case Types.SET_ABOUT_US_VIEWD: {
      return {
        ...state, ...{
          isAboutUsViewed: true,
        }
      }
    }
    case Types.SET_CONNECTION_ERROR: {
      return {
        ...state, ...{
          isConnectionError: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
