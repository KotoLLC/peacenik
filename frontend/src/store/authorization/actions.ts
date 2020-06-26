
import { ApiDataTypes } from './../../types'

export enum Types {
  LOGIN_REQUESTED = 'LOGIN_REQUESTED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

export const loginRequested = (payload: ApiDataTypes.Login) => ({
  type: Types.LOGIN_REQUESTED,
  payload
})

export const loginSucces = () => ({
  type: Types.LOGIN_SUCCESS
})

export const loginFailed = (payload: string) => ({
  type: Types.LOGIN_FAILED,
  payload
})

export default {
  loginRequested,
  loginSucces,
  loginFailed,
}