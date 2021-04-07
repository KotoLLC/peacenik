import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'
import messages from '@services/api/messages'

export interface State {
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubRequested: boolean
  isSendMessageSuccess: boolean
  friend_id: string | null // friend IP
  messages: ApiTypes.Feed.Message[] //current user messages
  usersLastMessage: ApiTypes.Messages.UserMessage[] //current user messages
  hubsWithMessages: Map<string, {
    messages: ApiTypes.Feed.Message[],
    lastMessageDate: string | null
  }>
  usersWithMessages: Map<string, {
    lastMessages: ApiTypes.Feed.Message,
    lastMessageDate: string | null
  }>
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  uploadLink: ApiTypes.UploadLink | null
  messageById: ApiTypes.Feed.Message | null | undefined
}

const peacenikmessagesTokens = localStorage.getItem('peacenikmessagesTokens') 
let messagesTokensLocal
if (peacenikmessagesTokens !== 'undefined' && peacenikmessagesTokens !== null) {
  messagesTokensLocal = JSON.parse(peacenikmessagesTokens)?.tokens
}
const initialState: State = {
  currentHub: {
    host: '',
    token: '',
  },
  isCurrentHubRequested: false,
  isSendMessageSuccess: false,
  messages: [],
  usersLastMessage: [],
  isMoreMessagesRequested: false,
  isMessagesRequested: null,
  friend_id: null, 
  hubsWithMessages: new Map([]),
  usersWithMessages: new Map([]),
  uploadLink: null,
  messageById: null,

}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_MESSAGE_TOKENS_SUCCESS: {
      return {
        ...state, ...{ 
          messagesTokens: action.payload,
        }
      }
    }
  
  //   case Types.POST_MESSAGE_MESSAGE_SUCCESS: {
  //     return {
  //       ...state, ...{ isMessageMessagePostedSuccess: action.payload }
  //     }
  //   }
  //   case Types.DELETE_MESSAGE_MESSAGES_REQUEST: {
  //     return {
  //       ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.body.message_id) }
  //     }
  //   }
  //   case Types.HIDE_MESSAGE_MESSAGES_REQUEST: {
  //     return {
  //       ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.id) }
  //     }
  //   }
    case Types.GET_MORE_MESSAGE_REQUEST: {
      return {
        ...state, ...{ isMoreMessagesRequested: true }
      }
    }
    case Types.GET_MORE_MESSAGE_FAILED: {
      return {
        ...state, ...{ isMoreMessagesRequested: false }
      }
    }
  //   case Types.GET_MORE_MESSAGE_FROM_HUB_FAILED: {
  //     return {
  //       ...state, ...{ isMoreMessagesRequested: false }
  //     }
  //   }
  //   case Types.GET_MORE_MESSAGE_SUCCESS: {
  //     return {
  //       ...state, ...{ 
  //         messagesTokens: action.payload,
  //         isMessagesRequested: false,
  //       }
  //     }
  //   }
    case Types.GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS: {
      const { usersLastMessage , hub } = action.payload

      return {
        ...state, 
        usersLastMessage: usersLastMessage       
      }
      
    }
  //   case Types.GET_MESSAGE_TOKENS_FROM_HUB_FAILED: {
  //     return {
  //       ...state, ...{ isMessagesRequested: false }
  //     }
  //   }
  //   case Types.GET_MESSAGE_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS: {
  //     return {
  //       ...state, ...{ uploadLink: action.payload }
  //     }
  //   }
  //   case Types.GET_LIKES_FOR_MESSAGE_MESSAGES_SUCCESS: {
  //     return {
  //       ...state, ...{ currentMessageLikes: action.payload }
  //     }
  //   }
  //   case Types.GET_LIKES_FOR_MESSAGE_COMMENT_SUCCESS: {
  //     return {
  //       ...state, ...{ currentCommentLikes: action.payload }
  //     }
  //   }
  //   case Types.GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS: {
  //     return {
  //       ...state, ...{ messageById: action.payload }
  //     }
  //   }
  //   case Types.RESET_MESSAGE_MESSAGES_BY_ID: {
  //     return {
  //       ...state, ...{ messageById: null }
  //     }
  //   }
  //   case Types.GET_MESSAGE_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED: {
  //     return {
  //       ...state, ...{ messageById: undefined }
  //     }
  //   }
  //   case Types.CLEAN_ALL_MESSAGE: {
  //     return {
  //       ...state, ...{ 
  //         messagesTokens: [],
  //         messages: [],
  //        }
  //     }
  //   }
    default: return state
  }
}

export default reducer
