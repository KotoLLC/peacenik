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
  directMsgRoomFriends: string[]
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
  directMsgRoomFriends: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ADD_FRIEND_TO_ROOM: {
      return {
        ...state, 
        directMsgRoomFriends: uniqBy([
          ...state.directMsgRoomFriends,
          action.payload
        ])
      }
    }
    case Types.GET_MESSAGE_TOKENS_SUCCESS: {
      return {
        ...state, ...{ 
          messagesTokens: action.payload,
        }
      }
    }
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
    case Types.GET_USER_LAST_MESSAGES_FROM_HUB_SUCCESS: {
      const { usersLastMessage , hub } = action.payload

      return {
        ...state, 
        usersLastMessage: usersLastMessage       
      }
      
    }
    default: return state
  }
}

export default reducer
