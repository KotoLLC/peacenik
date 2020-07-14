import { Types } from './actions'
import { NodeTypes, ApiTypes } from '../../types'
import uniqBy from 'lodash.uniqby'

export interface State {
  messageTokens: NodeTypes.CurrentNode[]
  currentNode: NodeTypes.CurrentNode
  isMessagePostedSuccess: boolean
  messages: ApiTypes.Messages.Message[]
}

const initialState: State = {
  messageTokens: [],
  currentNode: {
    host: '',
    token: '',
  },
  isMessagePostedSuccess: false,
  messages: []
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
        ...state, ...{ isMessagePostedSuccess: action.payload }
      }
    }
    case Types.DELETE_MESSAGE_REQUEST: {
      return {
        ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.body.message_id) }
      }
    }
    case Types.GET_MESSAGES_FROM_NODE_SUCCESS: {
      return {
        ...state, ...{ 
          messages: uniqBy([...state.messages, ...action.payload], 'id')
        }
      }
    }
    default: return state
  }
}

export default reducer
