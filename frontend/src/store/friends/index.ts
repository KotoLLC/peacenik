import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State {
  friends: ApiTypes.Friends.Friend[] | null
  friendsOfFriends: ApiTypes.Friends.Potential[]
  invitations: ApiTypes.Friends.Invitation[]
  isInviteByEmailSuccess: boolean
  isInvitationsDialogOpen: boolean
}

const initialState: State = {
  friends: null,
  friendsOfFriends: [],
  invitations: [],
  isInviteByEmailSuccess: false,
  isInvitationsDialogOpen: false,
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
    case Types.GET_INVITATIONS_SUCCESS: {
      return {
        ...state, ...{
          invitations: action.payload,
        }
      }
    }
    case Types.INVITE_BY_EMAIL_SUCCESS: {
      return {
        ...state, ...{
          isInviteByEmailSuccess: action.payload,
        }
      }
    }
    case Types.OPEN_INVITATIONS_DIALOG: {
      return {
        ...state, ...{
          isInvitationsDialogOpen: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
