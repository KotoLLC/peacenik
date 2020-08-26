import { Types } from './actions'

export interface State {
  errorMessage: string
  successMessage: string
  isAboutUsViewed: boolean
}

const kotoIsAboutUsViewed = sessionStorage.getItem('kotoIsAboutUsViewed')

const initialState: State = {
  errorMessage: '',
  successMessage: '',
  isAboutUsViewed: (kotoIsAboutUsViewed) ? JSON.parse(kotoIsAboutUsViewed) : false,
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
    default: return state
  }
}

export default reducer
