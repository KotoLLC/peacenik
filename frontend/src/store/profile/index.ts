import { Types } from './actions'
import { ApiTypes } from './../../types'

const profile = localStorage.getItem('kotoProfile')
const user: ApiTypes.Profile.UserProfile = profile ? JSON.parse(profile)?.user : {
  id: '',
  name: '',
  email: '',
  avatar_thumbnail: '',
}

export interface State extends ApiTypes.Profile.UserProfile {
  uploadLink: ApiTypes.UploadLink | null
}

const initialState: State = {
  ...user,
  uploadLink: null
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
    default: return state
  }
}

export default reducer
