import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State  {
  isGroupAddedSuccessfully: boolean
  isGroupEditedSuccessfully: boolean
  publicGroups: ApiTypes.Groups.RecievedGroup[]
  myGroups: ApiTypes.Groups.RecievedGroup[]
}

const initialState: State = {
  isGroupAddedSuccessfully: false,
  isGroupEditedSuccessfully: false,
  publicGroups: [],
  myGroups: [],
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
    default: return state
  }
}

export default reducer
