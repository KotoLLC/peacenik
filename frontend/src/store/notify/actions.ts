
export enum Types {
  SET_ERROR_NOTIFY = 'SET_ERROR_NOTIFY',
  SET_SUCCESS_NOTIFY = 'SET_SUCCESS_NOTIFY',
}

export const setErrorNotify = (payload: string) => ({
  type: Types.SET_ERROR_NOTIFY,
  payload
})
export const setSuccessNotify = (payload: string) => ({
  type: Types.SET_SUCCESS_NOTIFY,
  payload
})

export default {
  setErrorNotify,
  setSuccessNotify,
}