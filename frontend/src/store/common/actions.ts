
export enum Types {
  SET_ERROR_NOTIFY = 'SET_ERROR_NOTIFY',
  SET_SUCCESS_NOTIFY = 'SET_SUCCESS_NOTIFY',
  SET_ABOUT_US_VIEWD = 'SET_ABOUT_US_VIEWD',
}

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

export default {
  setErrorNotify,
  setSuccessNotify,
  setAboutUsViewed,
}