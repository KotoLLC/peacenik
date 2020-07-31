
export enum Types {
  SET_ERROR_NOTIFY = 'SET_ERROR_NOTIFY',
  SET_SUCCESS_NOTIFY = 'SET_SUCCESS_NOTIFY',
  
  SET_PRELOADER_ACTIVE = 'SET_PRELOADER_ACTIVE',
}

const setErrorNotify = (payload: string) => ({
  type: Types.SET_ERROR_NOTIFY,
  payload
})

const setSuccessNotify = (payload: string) => ({
  type: Types.SET_SUCCESS_NOTIFY,
  payload
})

const setPreloaderActive = (payload: boolean) => ({
  type: Types.SET_PRELOADER_ACTIVE,
  payload
})

export default {
  setErrorNotify,
  setSuccessNotify,
  setPreloaderActive,
}