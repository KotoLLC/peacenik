import { ApiTypes } from './../../types'

export enum Types {
  SEND_CONFIRM_LINK_REQUEST = 'SEND_CONFIRM_LINK_REQUEST',
  SEND_CONFIRM_LINK_SUCCESS = 'SEND_CONFIRM_LINK_SUCCESS',

  CONFIRM_USER_REQUEST = 'CONFIRM_USER_REQUEST',
  CONFIRM_USER_SUCCESS = 'CONFIRM_USER_SUCCESS',
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

export default {
  sendConfirmLinkRequest,
  sendConfirmLinkSucces,
  confirmUserRequest,
  confirmUserSucces,
}