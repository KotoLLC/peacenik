import { Types } from './actions'
import { ApiTypes, NodeTypes } from '../../types'

export interface State {
  messageTokens: ApiTypes.Token[]
  currentNode: NodeTypes.CurrentNode
  isPostMessageSuccess: boolean
}

const initialState: State = {
  messageTokens: [],
  currentNode: {
    host: '',
    token: '',
  },
  isPostMessageSuccess: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_MESSAGES_SUCCESS: {
      return {
        ...state, ...{ messageTokens: action.payload }
      }
    }
    case Types.GET_CURRENT_NODE_SUCCESS: {
      return {
        ...state, ...{ currentNode: action.payload }
      }
    }
    case Types.POST_MESSAGE_SUCCESS: {
      return {
        ...state, ...{ isPostMessageSuccess: action.payload }
      }
    }
    default: return state
  }
}

export default reducer
