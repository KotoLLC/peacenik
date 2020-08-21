import { Types } from './actions'

export interface State {
  registrationErrorMessage: string
  isRegisterSuccess: boolean
  isConfirmUserSuccess: boolean
  isUserRegisteredResult: boolean | null
}

const initialState: State = {
  registrationErrorMessage: '',
  isRegisterSuccess: false,
  isConfirmUserSuccess: false,
  isUserRegisteredResult: null,
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
    
    case Types.CONFIRM_USER_SUCCESS: {
      return { ...state, ...{ 
        isConfirmUserSuccess: true
      } }
    }
    
    case Types.CHECK_IS_USER_REGISTERED_RESULT: {
      return { ...state, ...{ 
        isUserRegisteredResult: action.payload
      } }
    }
    
    default: return state
  }
}

export default reducer
