import { Types } from './actions'

export interface State {
  registrationErrorMessage: string
  isRegisterSuccess: boolean
}

const initialState: State = {
  registrationErrorMessage: '',
  isRegisterSuccess: false
} 

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.REGISTER_USER_REQUEST: {
      return { ...state, ...{ 
        registrationErrorMessage: '',
      } }
    }
    
    case Types.REGISTER_USER_SUCCESS: {
      return { ...state, ...{ 
        isRegisterSuccess: true,
        registrationErrorMessage: '',
      } }
    }
    
    case Types.REGISTER_USER_FAILED: {
      return { ...state, ...{ 
        isRegisterSuccess: false,
        registrationErrorMessage: action.payload
      } }
    }
    
    case Types.RESET_REGISTRATION_RESULT: {
      return { ...state, ...{ 
        isRegisterSuccess: false,
        registrationErrorMessage: ''
      } }
    }
    
    default: return state
  }
}

export default reducer
