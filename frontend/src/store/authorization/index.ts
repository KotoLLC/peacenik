import { Types } from './actions'

export interface State {
  isLogged: boolean,
  loginErrorMessage: string
}

const token = localStorage.getItem('koto-token')
const initialState: State = {
  isLogged: (token) ? true : false,
  loginErrorMessage: '',
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
    default: return state
  }
}

export default reducer
