import { Types } from './actions'
import { ApiTypes } from 'src/types'

const profile = localStorage.getItem('kotoProfile')
const user: ApiTypes.Profile.UserProfile = profile ? JSON.parse(profile) : {
  user: {
    id: '',
    name: '',
    email: '',
  },
}

export interface State extends ApiTypes.Profile.UserProfile {
  uploadLink: ApiTypes.UploadLink | null
  profileErrorMessage: string
}

const initialState: State = {
  ...user,
  uploadLink: null,
  profileErrorMessage: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_PROFILE_SUCCESS: {
      return {
        ...state, ...action.payload
      }
    }
    case Types.GET_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{
          uploadLink: action.payload
        }
      }
    }
    case Types.EDIT_PROFILE_FAILED: {
      return {
        ...state, ...{
          profileErrorMessage: action.payload
        }
      }
    }
    case Types.RESET_PROFILE_ERROR_MESSAGE: {
      return {
        ...state, ...{
          profileErrorMessage: ''
        }
      }
    }
    default: return state
  }
}

export default reducer
