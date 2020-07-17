
export enum Types {
  SET_ERROR_NOTIFY = 'SET_ERROR_NOTIFY',
  SET_SUCCESS_NOTIFY = 'SET_SUCCESS_NOTIFY',
}

const setErrorNotify = (payload: string) => ({
  type: Types.SET_ERROR_NOTIFY,
  payload
})

const setSuccessNotify = (payload: string) => ({
  type: Types.SET_SUCCESS_NOTIFY,
  payload
})

export default {
  setErrorNotify,
  setSuccessNotify,
}