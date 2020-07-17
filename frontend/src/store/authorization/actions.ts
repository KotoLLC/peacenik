
import { ApiTypes } from './../../types'

export enum Types {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  RESET_LOGIN_FAILED_MESSAGE = 'RESET_LOGIN_FAILED_MESSAGE',

  LOGOUT_REQUEST = 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  
  GET_AUTH_TOKEN_REQUEST = 'GET_AUTH_TOKEN_REQUEST',
  GET_AUTH_TOKEN_SUCCESS = 'GET_AUTH_TOKEN_SUCCESS',
}

const loginRequest = (payload: ApiTypes.Login) => ({
  type: Types.LOGIN_REQUEST,
  payload
})

const loginSucces = () => ({
  type: Types.LOGIN_SUCCESS
})

const loginFailed = (payload: string) => ({
  type: Types.LOGIN_FAILED,
  payload
})

const resetLoginFailedMessage = () => ({
  type: Types.RESET_LOGIN_FAILED_MESSAGE
})

const logoutRequest = () => ({
  type: Types.LOGOUT_REQUEST,
})

const logoutSucces = () => ({
  type: Types.LOGOUT_SUCCESS
})

const getAuthTokenRequest = () => ({
  type: Types.GET_AUTH_TOKEN_REQUEST,
})

const getAuthTokenSucces = (payload: string) => ({
  type: Types.GET_AUTH_TOKEN_SUCCESS,
  payload,
})

export default {
  loginRequest,
  loginSucces,
  loginFailed,
  resetLoginFailedMessage,
  logoutRequest,
  logoutSucces,
  getAuthTokenRequest,
  getAuthTokenSucces,
}