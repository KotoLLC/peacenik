import { Types } from './actions'

export interface State {
  isLogged: boolean,
  loginErrorMessage: string
  passwordErrorMessage: string
  isForgotPasswordSent: boolean
  authToken: string
}

const isLogged = localStorage.getItem('kotoIsLogged')
const authToken = localStorage.getItem('kotoAuthToken')

const initialState: State = {
  isLogged: (isLogged === 'true') ? true : false,
  loginErrorMessage: '',
  passwordErrorMessage: '',
  isForgotPasswordSent: false,
  authToken: authToken ? JSON.parse(authToken) : '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN_SUCCESS: {
      return { ...state, ...{ 
        isLogged: true,
        loginErrorMessage: '',
      } }
    }
    case Types.LOGIN_FAILED: {
      return { ...state, ...{ 
        isLogged: false, 
        loginErrorMessage: action.payload,
      } }
    }
    case Types.RESET_LOGIN_FAILED_MESSAGE: {
      return { ...state, ...{ 
        loginErrorMessage: '',
      } }
    }
    case Types.LOGOUT_SUCCESS: {
      return { ...state, ...{ 
        isLogged: false, 
      } }
    }
    case Types.LOGOUT_REQUEST: {
      return { ...state, ...{ 
        loginErrorMessage: '', 
      } }
    }
    case Types.GET_AUTH_TOKEN_SUCCESS: {
      return { ...state, ...{ 
        authToken: action.payload, 
      } }
    }
    case Types.FORGOT_PASSWORD_FAILED: {
      return { ...state, ...{ 
        passwordErrorMessage: action.payload, 
      } }
    }
    case Types.CLEAN_PASSWORD_FAILED_MESSAGE: {
      return { ...state, ...{ 
        passwordErrorMessage: '', 
        isForgotPasswordSent: false,
      } }
    }
    case Types.FORGOT_PASSWORD_SUCCESS: {
      return { ...state, ...{ 
        isForgotPasswordSent: true, 
      } }
    }
    default: return state
  }
}

export default reducer
