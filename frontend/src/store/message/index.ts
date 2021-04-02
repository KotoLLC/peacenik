import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'
export interface State {
  messagesTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  uploadLink: ApiTypes.UploadLink | null
}

const peacenikmessagesTokens = localStorage.getItem('peacenikmessagesTokens') 
let messagesTokensLocal
if (peacenikmessagesTokens !== 'undefined' && peacenikmessagesTokens !== null) {
  messagesTokensLocal = JSON.parse(peacenikmessagesTokens)?.tokens
}

const initialState: State = {
  messagesTokens: messagesTokensLocal || [],
  currentHub: {
    host: '',
    token: '',
  }, 
  uploadLink: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  //   case Types.GET_MESSAGE_TOKENS_SUCCESS: {
  //     return {
  //       ...state, ...{ 
  //         messagesTokens: action.payload,
  //       }
  //     }
  //   }
  //   case Types.GET_CURRENT_HUB_REQUEST: {
  //     return {
  //       ...state, ...{ 
  //         isCurrentHubRequested: true,
  //        }
  //     }
  //   }
  //   case Types.GET_CURRENT_HUB_SUCCESS: {
  //     return {
  //       ...state, ...{ 
  //         currentHub: action.payload,
  //         isCurrentHubRequested: false,
  //        }
  //     }
  //   }
  //   case Types.GET_CURRENT_HUB_FAILED: {
  //     return {
  //       ...state, ...{ 
  //         currentHub: {
  //         host: '',
  //         token: '',
  //       },
  //       isCurrentHubRequested: false,
  //     }
  //     }
  //   }
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
  //   case Types.GET_MORE_MESSAGE_REQUEST: {
  //     return {
  //       ...state, ...{ isMoreMessagesRequested: true }
  //     }
  //   }
  //   case Types.GET_MORE_MESSAGE_FAILED: {
  //     return {
  //       ...state, ...{ isMoreMessagesRequested: false }
  //     }
  //   }
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
  //   case Types.GET_MESSAGE_TOKENS_FROM_HUB_SUCCESS: {
  //     const { messages, hub } = action.payload

  //     const addMassagesToHubsWithMessages = () => {
  //       const currentHub = state.hubsWithMessages.get(hub)
  //       if (currentHub) {
  //         return uniqBy([...currentHub.messages, ...messages], 'id')
  //       } 
  //       return messages
  //     }

  //     return {
  //       ...state, ...{ 
  //         isMoreMessagesRequested: false,
  //         messages: uniqBy([...messages, ...state.messages], 'id'),
  //         hubsWithMessages: state.hubsWithMessages.set(hub, {
  //           messages: addMassagesToHubsWithMessages(),
  //           lastMessageDate: messages.length ? messages[messages.length - 1]?.updated_at : null
  //         })
  //       }
  //     }
  //   }
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
