import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State  {
  isGroupAddedSuccessfully: boolean
  isGroupEditedSuccessfully: boolean
  isGroupDeletedSuccessfully: boolean
  isMemberDeletedSuccessfully: boolean
  joinToGroupRequestSuccessfully: boolean
  publicGroups: ApiTypes.Groups.RecievedGroup[]
  myGroups: ApiTypes.Groups.RecievedGroup[]
  groupDetails: ApiTypes.Groups.GroupDetails | null
  invitesToConfirm: ApiTypes.Groups.InviteToConfirm[]
}

const initialState: State = {
  isGroupAddedSuccessfully: false,
  isGroupEditedSuccessfully: false,
  isGroupDeletedSuccessfully: false,
  isMemberDeletedSuccessfully: false,
  joinToGroupRequestSuccessfully: false,
  publicGroups: [],
  myGroups: [],
  groupDetails: null,
  invitesToConfirm: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ADD_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupAddedSuccessfully: action.payload
        }
      }
    }
    case Types.EDIT_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupEditedSuccessfully: action.payload
        }
      }
    }
    case Types.GET_PUBLIC_GROUPS_SUCCESS: {
      return {
        ...state, ...{
          publicGroups: action.payload
        }
      }
    }
    case Types.GET_MY_GROUPS_SUCCESS: {
      return {
        ...state, ...{
          myGroups: action.payload
        }
      }
    }
    case Types.GET_GROUP_DETAILS_SUCCESS: {
      return {
        ...state, ...{
          groupDetails: action.payload
        }
      }
    }
    case Types.DELETE_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupDeletedSuccessfully: action.payload
        }
      }
    }
    case Types.JOIN_TO_GROUP_SUCCESS: {
      return {
        ...state, ...{
          joinToGroupRequestSuccessfully: action.payload
        }
      }
    }
    case Types.GET_INVITES_TO_CONFIRM_SUCCESS: {
      return {
        ...state, ...{
          invitesToConfirm: action.payload
        }
      }
    }
    case Types.DELETE_MEMBER_SUCCESS: {
      return {
        ...state, ...{
          isMemberDeletedSuccessfully: action.payload
        }
      }
    }
    default: return state
  }
}

export default reducer
