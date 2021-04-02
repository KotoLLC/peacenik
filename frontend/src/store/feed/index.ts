import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'
interface GroupMessageToken{
  host: string
  token: string
}
export interface State {
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubRequested: boolean
  isFeedMessagePostedSuccess: boolean
  messages: ApiTypes.Feed.Message[]
  hubsWithMessages: Map<string, {
    messages: ApiTypes.Feed.Message[],
    lastMessageDate: string | null
  }>
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  uploadLink: ApiTypes.UploadLink | null
  currentMessageLikes: ApiTypes.Feed.LikesInfoData | null
  currentCommentLikes: ApiTypes.Feed.LikesInfoData | null
  messageById: ApiTypes.Feed.Message | null | undefined
  groupMessages: any
  groupMessageToken: GroupMessageToken
}

const peacenikfeedsTokens = localStorage.getItem('peacenikfeedsTokens') 
let feedsTokensLocal
if (peacenikfeedsTokens !== 'undefined' && peacenikfeedsTokens !== null) {
  feedsTokensLocal = JSON.parse(peacenikfeedsTokens)?.tokens
}

const initialState: State = {
  feedsTokens: feedsTokensLocal || [],
  currentHub: {
    host: '',
    token: '',
  },
  isCurrentHubRequested: false,
  isFeedMessagePostedSuccess: false,
  messages: [],
  isMoreMessagesRequested: false,
  isMessagesRequested: null,
  hubsWithMessages: new Map([]),
  uploadLink: null,
  currentMessageLikes: null,
  currentCommentLikes: null,
  messageById: null,
  groupMessages: [],
  groupMessageToken: {
    host: "",
    token: ""
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_FEED_TOKENS_SUCCESS: {
      return {
        ...state, ...{ 
          feedsTokens: action.payload,
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
    case Types.POST_FEED_MESSAGE_SUCCESS: {
      return {
        ...state, ...{ isFeedMessagePostedSuccess: action.payload }
      }
    }
    case Types.DELETE_FEED_MESSAGES_REQUEST: {
      return {
        ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.body.message_id) }
      }
    }
    case Types.HIDE_FEED_MESSAGES_REQUEST: {
      return {
        ...state, ...{ messages: state.messages.filter(item => item.id !== action.payload.id) }
      }
    }
    case Types.GET_MORE_FEED_REQUEST: {
      return {
        ...state, ...{ isMoreMessagesRequested: true }
      }
    }
    case Types.GET_MORE_FEED_FAILED: {
      return {
        ...state, ...{ isMoreMessagesRequested: false }
      }
    }
    case Types.GET_MORE_FEED_FROM_HUB_FAILED: {
      return {
        ...state, ...{ isMoreMessagesRequested: false }
      }
    }
    case Types.GET_MORE_FEED_SUCCESS: {
      return {
        ...state, ...{ 
          feedsTokens: action.payload,
          isMessagesRequested: false,
        }
      }
    }
    case Types.GET_GROUP_FEED_SUCCESS: {
      const { messages } = action.payload
      console.log("GET_GROUP_FEED_SUCCESS messages: ", messages)

      return {
        ...state,
        groupMessages: uniqBy([...messages, ...state.groupMessages], 'id')
      }
    }
    case Types.SET_GROUP_FEED_TOKEN:{
      return {
        ...state,
        groupMessageToken: action.payload
      }
    }
    case Types.GET_FEED_TOKENS_FROM_HUB_SUCCESS: {
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
    case Types.GET_FEED_TOKENS_FROM_HUB_FAILED: {
      return {
        ...state, ...{ isMessagesRequested: false }
      }
    }
    case Types.GET_FEED_TOKENS_MESSAGES_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{ uploadLink: action.payload }
      }
    }
    case Types.GET_LIKES_FOR_FEED_MESSAGES_SUCCESS: {
      return {
        ...state, ...{ currentMessageLikes: action.payload }
      }
    }
    case Types.GET_LIKES_FOR_FEED_COMMENT_SUCCESS: {
      return {
        ...state, ...{ currentCommentLikes: action.payload }
      }
    }
    case Types.GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_SUCCESS: {
      return {
        ...state, ...{ messageById: action.payload }
      }
    }
    case Types.RESET_FEED_MESSAGES_BY_ID: {
      return {
        ...state, ...{ messageById: null }
      }
    }
    case Types.GET_FEED_TOKENS_MESSAGES_BY_ID_FROM_HUB_FAILED: {
      return {
        ...state, ...{ messageById: undefined }
      }
    }
    case Types.CLEAN_ALL_FEED: {
      return {
        ...state, ...{ 
          feedsTokens: [],
          messages: [],
         }
      }
    }
    default: return state
  }
}

export default reducer
