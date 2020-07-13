import { Types } from './actions'
import { ApiTypes } from '../../types'

export interface State {
  messageTokens: ApiTypes.Token[]
  currentToken: ApiTypes.Token
}

const messageTokens = localStorage.getItem('messageTokens')
const initialState: State = {
  messageTokens: messageTokens ? JSON.parse(messageTokens) : [],
  currentToken: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_MESSAGES_SUCCESS: {
      return {
        ...state, ...{ messageTokens: action.payload }
      }
    }
    case Types.GET_CURRENT_TOKEN_SUCCESS: {
      return {
        ...state, ...{ currentToken: action.payload }
      }
    }
    default: return state
  }
}

export default reducer
