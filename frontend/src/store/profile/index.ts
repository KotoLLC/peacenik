import { Types } from './actions'
import { ApiTypes } from 'src/types'

const profile = localStorage.getItem('peacenikProfile')
const user: ApiTypes.Profile.UserProfile = profile ? JSON.parse(profile) : {
  user: {
    id: '',
    name: '',
    email: '', 
  },
}

export interface State extends ApiTypes.Profile.UserProfile {
  avatarUploadLink: ApiTypes.UploadLink | null
  profileErrorMessage: string
  owned_hubs: string[]
  users: ApiTypes.User[]
  coverUploadLink: ApiTypes.UploadLink | null
}

const initialState: State = {
  ...user,
  avatarUploadLink: null,
  profileErrorMessage: '',
  owned_hubs: [],
  users: [], 
  coverUploadLink: null
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
          avatarUploadLink: action.payload
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
    case Types.GET_USERS_SUCCESS: {
      return {
        ...state, ...{
          users: action.payload
        }
      }
    }
    case Types.GET_PROFILE_COVER_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{ 
          coverUploadLink: action.payload 
        }
      }
    }
    default: return state
  }
}

export default reducer
