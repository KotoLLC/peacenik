import { Types } from './actions'

export interface State {
  isLogged: boolean,
  loginErrorMessage: string
  authToken: string
}

const isLogged = localStorage.getItem('kotoIsLogged')
const authToken = localStorage.getItem('kotoAuthToken')

const initialState: State = {
  isLogged: (isLogged === 'true') ? true : false,
  loginErrorMessage: '',
  authToken: authToken ? JSON.parse(authToken) : ''
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
    case Types.GET_AUTH_TOKEN_SUCCESS: {
      return { ...state, ...{ 
        authToken: action.payload, 
      } }
    }
    default: return state
  }
}

export default reducer
