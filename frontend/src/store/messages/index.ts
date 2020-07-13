import { Types } from './actions'
import { ApiTypes, NodeTypes } from '../../types'

export interface State {
  messageTokens: ApiTypes.Token[]
  currentNode: NodeTypes.CurrentNode
}

const messageTokens = localStorage.getItem('messageTokens')
const initialState: State = {
  messageTokens: messageTokens ? JSON.parse(messageTokens) : [],
  currentNode: {
    host: '',
    token: '',
  },
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
    default: return state
  }
}

export default reducer
