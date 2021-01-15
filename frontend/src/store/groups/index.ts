import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State  {
  isGroupAddedSuccessfully: boolean
}

const initialState: State = {
  isGroupAddedSuccessfully: false
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
    default: return state
  }
}

export default reducer
