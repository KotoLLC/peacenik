import { Types } from './actions'
import { CommonTypes } from 'src/types'

export interface State {
  isNodeCreatedSuccessfully: boolean,
  nodeslist: CommonTypes.NodeTypes.Node[]
}

const initialState: State = {
  isNodeCreatedSuccessfully: false,
  nodeslist: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.NODE_CREATE_SUCCESS: {
      return {
        ...state, ...{
          isNodeCreatedSuccessfully: true,
        }
      }
    }
    case Types.NODE_CREATION_STATUS_RESET: {
      return {
        ...state, ...{
          isNodeCreatedSuccessfully: false,
        }
      }
    }
    case Types.GET_NODES_SUCCESS: {
      return {
        ...state, ...{
          nodeslist: action.payload,
        }
      }
    }
    default: return state
  }
}

export default reducer
