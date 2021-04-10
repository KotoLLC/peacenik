
export enum Types {
  GET_MSG_TOKEN         = `GET_MSG_TOKEN`,
  SET_ERROR_NOTIFY      = 'SET_ERROR_NOTIFY',
  SET_SUCCESS_NOTIFY    = 'SET_SUCCESS_NOTIFY',
  SET_ABOUT_US_VIEWD    = 'SET_ABOUT_US_VIEWD',
  SET_CONNECTION_ERROR  = 'SET_CONNECTION_ERROR',
}

const getMsgToken = () => ({
  type: Types.GET_MSG_TOKEN
})

const setErrorNotify = (payload: string) => ({
  type: Types.SET_ERROR_NOTIFY,
  payload
})

const setSuccessNotify = (payload: string) => ({
  type: Types.SET_SUCCESS_NOTIFY,
  payload
})

const setAboutUsViewed = () => ({
  type: Types.SET_ABOUT_US_VIEWD
})

const setConnectionError = (payload: boolean) => ({
  type: Types.SET_CONNECTION_ERROR,
  payload
})

export default {
  getMsgToken,
  setErrorNotify,
  setSuccessNotify,
  setAboutUsViewed,
  setConnectionError,
}