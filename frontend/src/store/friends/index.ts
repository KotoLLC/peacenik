import { Types } from './actions'
import { ApiTypes } from './../../types'

export interface State {
  friends: ApiTypes.User[],
  friendsOfFriends: ApiTypes.FriendsOfFriend[],
}

const initialState: State = {
  friends: [],
  friendsOfFriends: [],
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
    case Types.GET_FRIENDS_OF_FRIENDS_SUCCESS: {
      return {
        ...state, ...{
          friendsOfFriends: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
