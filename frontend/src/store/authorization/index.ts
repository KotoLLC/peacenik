import { Types } from './actions'

export interface State {
  isLogged: boolean,
  loginErrorMessage: string
  passwordErrorMessage: string
  isForgotPasswordSent: boolean
  isForgotUserNameSent: boolean
  isResetPasswordSuccess: boolean
  authToken: string
}

const isLogged = localStorage.getItem('kotoIsLogged')
const authToken = localStorage.getItem('kotoAuthToken')

const initialState: State = {
  isLogged: (isLogged === 'true') ? true : false,
  loginErrorMessage: '',
  passwordErrorMessage: '',
  isForgotPasswordSent: false,
  isForgotUserNameSent: false,
  isResetPasswordSuccess: false,
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
    case Types.RESET_PASSWORD_FAILED: {
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
    case Types.RESET_PASSWORD_SUCCESS: {
      return { ...state, ...{ 
        isResetPasswordSuccess: true, 
      } }
    }
    case Types.FORGOT_USERNAME_REQUEST: {
      return { ...state, ...{ 
        isForgotUserNameSent: true, 
      } }
    }
    case Types.FORGOT_USERNAME_FAILED: {
      return { ...state, ...{ 
        isForgotUserNameSent: false, 
      } }
    }
    case Types.FORGOT_USERNAME_SUCCESS: {
      return { ...state, ...{ 
        isForgotUserNameSent: false, 
      } }
    }
    default: return state
  }
}

export default reducer
