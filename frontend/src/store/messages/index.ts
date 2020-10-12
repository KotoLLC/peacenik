import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'
export interface State {
  messageTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubRequested: boolean
  isMessagePostedSuccess: boolean
  messages: ApiTypes.Messages.Message[]
  hubsWithMessages: Map<string, {
    messages: ApiTypes.Messages.Message[],
    lastMessageDate: string | null
  }>
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  uploadLink: ApiTypes.UploadLink | null
  currentMessageLikes: ApiTypes.Messages.LikesInfoData | null
  currentCommentLikes: ApiTypes.Messages.LikesInfoData | null
  messageById: ApiTypes.Messages.Message | null | undefined
}

const kotoMessageTokens = localStorage.getItem('kotoMessageTokens') 
let messageTokensLocal
if (kotoMessageTokens !== 'undefined' && kotoMessageTokens !== null) {
  messageTokensLocal = JSON.parse(kotoMessageTokens)?.tokens
}

const initialState: State = {
  messageTokens: messageTokensLocal || [],
  currentHub: {
    host: '',
    token: '',
  },
  isCurrentHubRequested: false,
  isMessagePostedSuccess: false,
  messages: [],
  isMoreMessagesRequested: false,
  isMessagesRequested: null,
  hubsWithMessages: new Map([]),
  uploadLink: null,
  currentMessageLikes: null,
  currentCommentLikes: null,
  messageById: null,
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
    case Types.GET_CURRENT_HUB_REQUEST: {
      return {
        ...state, ...{ 
          isCurrentHubRequested: true,
         }
      }
    }
    case Types.GET_CURRENT_HUB_SUCCESS: {
      return {
        ...state, ...{ 
          currentHub: action.payload,
          isCurrentHubRequested: false,
         }
      }
    }
    case Types.GET_CURRENT_HUB_FAILED: {
      return {
        ...state, ...{ 
          currentHub: {
          host: '',
          token: '',
        },
        isCurrentHubRequested: false,
      }
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
    case Types.HIDE_MESSAGE_REQUEST: {
      return {
        ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.id) }
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
    case Types.GET_MORE_MESSAGES_FROM_HUB_FAILED: {
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
    case Types.GET_MESSAGES_FROM_HUB_SUCCESS: {
      const { messages, hub } = action.payload

      const addMassagesToHubsWithMessages = () => {
        const currentHub = state.hubsWithMessages.get(hub)
        if (currentHub) {
          return uniqBy([...currentHub.messages, ...messages], 'id')
        } 
        return messages
      }

      return {
        ...state, ...{ 
          isMoreMessagesRequested: false,
          messages: uniqBy([...messages, ...state.messages], 'id'),
          hubsWithMessages: state.hubsWithMessages.set(hub, {
            messages: addMassagesToHubsWithMessages(),
            lastMessageDate: messages.length ? messages[messages.length - 1]?.updated_at : null
          })
        }
      }
    }
    case Types.GET_MESSAGES_FROM_HUB_FAILED: {
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
    case Types.GET_MESSAGE_BY_ID_FROM_HUB_SUCCESS: {
      return {
        ...state, ...{ messageById: action.payload }
      }
    }
    case Types.RESET_MESSAGE_BY_ID: {
      return {
        ...state, ...{ messageById: null }
      }
    }
    case Types.GET_MESSAGE_BY_ID_FROM_HUB_FAILED: {
      return {
        ...state, ...{ messageById: undefined }
      }
    }
    case Types.CLEAN_ALL_MESSAGES: {
      return {
        ...state, ...{ 
          messageTokens: [],
          messages: [],
         }
      }
    }
    default: return state
  }
}

export default reducer
