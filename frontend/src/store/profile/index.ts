import { Types } from './actions'
import { ApiTypes } from './../../types'

export interface State extends ApiTypes.Profile {}

const profile = localStorage.getItem('kotoProfile')
const initialState: State = profile ? JSON.parse(profile) : {
  user: {
    id: '',
    name: '',
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_PROFILE_SUCCESS: {
      return {
        ...state, ...action.payload
      }
    }
    default: return state
  }
}

export default reducer
