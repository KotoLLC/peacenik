import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'
export interface State {
  messageTokens: CommonTypes.NodeTypes.CurrentNode[]
  currentNode: CommonTypes.NodeTypes.CurrentNode
  isMessagePostedSuccess: boolean
  messages: ApiTypes.Messages.Message[]
  nodesWithMessages: Map<string, {
    messages: ApiTypes.Messages.Message[],
    lastMessageDate: string | null
  }>
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  uploadLink: ApiTypes.UploadLink | null
  currentMessageLikes: ApiTypes.Messages.LikesInfoData | null
  currentCommentLikes: ApiTypes.Messages.LikesInfoData | null
}

const initialState: State = {
  messageTokens: [],
  currentNode: {
    host: '',
    token: '',
  },
  isMessagePostedSuccess: false,
  messages: [],
  isMoreMessagesRequested: false,
  isMessagesRequested: null,
  nodesWithMessages: new Map([]),
  uploadLink: null,
  currentMessageLikes: null,
  currentCommentLikes: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_MESSAGES_SUCCESS: {
      return {
        ...state, ...{ 
          messageTokens: action.payload,
        }
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
    case Types.GET_MORE_MESSAGES_REQUEST: {
      return {
        ...state, ...{ isMoreMessagesRequested: true }
      }
    }
    case Types.GET_MORE_MESSAGES_FAILED: {
      return {
        ...state, ...{ isMoreMessagesRequested: false }
      }
    }
    case Types.GET_MORE_MESSAGES_FROM_NODE_FAILED: {
      return {
        ...state, ...{ isMoreMessagesRequested: false }
      }
    }
    case Types.GET_MORE_MESSAGES_SUCCESS: {
      return {
        ...state, ...{ 
          messageTokens: action.payload,
          isMessagesRequested: false,
        }
      }
    }
    case Types.GET_MESSAGES_FROM_NODE_SUCCESS: {
      const { messages, node } = action.payload

      const addMassagesToNodesWithMessages = () => {
        const currentNode = state.nodesWithMessages.get(node)  
        if (currentNode) {
          return uniqBy([...currentNode.messages, ...messages], 'id')
        } 
        return messages
      }

      return {
        ...state, ...{ 
          isMoreMessagesRequested: false,
          messages: uniqBy([...messages, ...state.messages], 'id'),
          nodesWithMessages: state.nodesWithMessages.set(node, {
            messages: addMassagesToNodesWithMessages(),
            lastMessageDate: messages.length ? messages[messages.length - 1]?.updated_at : null
          })
        }
      }
    }
    case Types.GET_MESSAGES_FROM_NODE_FAILED: {
      return {
        ...state, ...{ isMessagesRequested: false }
      }
    }
    case Types.GET_MESSAGE_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{ uploadLink: action.payload }
      }
    }
    case Types.GET_LIKES_FOR_MESSAGE_SUCCESS: {
      return {
        ...state, ...{ currentMessageLikes: action.payload }
      }
    }
    case Types.GET_LIKES_FOR_COMMENT_SUCCESS: {
      return {
        ...state, ...{ currentCommentLikes: action.payload }
      }
    }
    default: return state
  }
}

export default reducer
