import { Types } from './actions'
import { ApiTypes } from './../../types'

export interface State {
  friends: ApiTypes.Friend[],
}

const initialState: State = {
  friends: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_FRIENDS_SUCCESS: {
      return {
        ...state, ...{
          friends: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
