import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State  {
  isGroupAddedSuccessfully: boolean
  isGroupEditedSuccessfully: boolean
  isGroupDeletedSuccessfully: boolean
  publicGroups: ApiTypes.Groups.RecievedGroup[]
  myGroups: ApiTypes.Groups.RecievedGroup[]
  groupDetails: ApiTypes.Groups.GroupDetails | null
}

const initialState: State = {
  isGroupAddedSuccessfully: false,
  isGroupEditedSuccessfully: false,
  isGroupDeletedSuccessfully: false,
  publicGroups: [],
  myGroups: [],
  groupDetails: null
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
    default: return state
  }
}

export default reducer
