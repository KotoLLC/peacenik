
import { ApiTypes } from './../../types'

export enum Types {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  RESET_LOGIN_FAILED_MESSAGE = 'RESET_LOGIN_FAILED_MESSAGE',

  LOGOUT_REQUEST = 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
}

export const loginRequest = (payload: ApiTypes.Login) => ({
  type: Types.LOGIN_REQUEST,
  payload
})

export const loginSucces = () => ({
  type: Types.LOGIN_SUCCESS
})

export const loginFailed = (payload: string) => ({
  type: Types.LOGIN_FAILED,
  payload
})

export const resetLoginFailedMessage = () => ({
  type: Types.RESET_LOGIN_FAILED_MESSAGE
})

export const logoutRequest = () => ({
  type: Types.LOGOUT_REQUEST,
})

export const logoutSucces = () => ({
  type: Types.LOGOUT_SUCCESS
})

export default {
  loginRequest,
  loginSucces,
  loginFailed,
  resetLoginFailedMessage,
  logoutRequest,
  logoutSucces,
}