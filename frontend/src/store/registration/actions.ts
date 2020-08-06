import { ApiTypes } from 'src/types'

export enum Types {
  SEND_CONFIRM_LINK_REQUEST = 'SEND_CONFIRM_LINK_REQUEST',
  SEND_CONFIRM_LINK_SUCCESS = 'SEND_CONFIRM_LINK_SUCCESS',

  CONFIRM_USER_REQUEST = 'CONFIRM_USER_REQUEST',
  CONFIRM_USER_SUCCESS = 'CONFIRM_USER_SUCCESS',
  
  REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST',
  REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS',
  REGISTER_USER_FAILED = 'REGISTER_USER_FAILED',

  RESET_REGISTRATION_RESULT = 'RESET_REGISTRATION_RESULT',
}

const sendConfirmLinkRequest = () => ({
  type: Types.SEND_CONFIRM_LINK_REQUEST,
})

const sendConfirmLinkSucces = () => ({
  type: Types.SEND_CONFIRM_LINK_SUCCESS
})

const confirmUserRequest = (payload: ApiTypes.Token) => ({
  type: Types.CONFIRM_USER_REQUEST,
  payload,
})

const confirmUserSucces = () => ({
  type: Types.CONFIRM_USER_SUCCESS
})

const registerUserRequest = (payload: ApiTypes.RegisterUser) => ({
  type: Types.REGISTER_USER_REQUEST,
  payload,
})

const registerUserSucces = () => ({
  type: Types.REGISTER_USER_SUCCESS
})

const registerUserFailed = (payload: string) => ({
  type: Types.REGISTER_USER_FAILED,
  payload,
})

const resetRegistrationResult = () => ({
  type: Types.RESET_REGISTRATION_RESULT
})

export default {
  sendConfirmLinkRequest,
  sendConfirmLinkSucces,
  confirmUserRequest,
  confirmUserSucces,
  registerUserRequest,
  registerUserSucces,
  resetRegistrationResult,
  registerUserFailed,
}
