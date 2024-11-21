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
  directMsgRoomFriends: CommonTypes.MessageRoomFriendData[]
  directPostToken: CommonTypes.TokenData
  directMsgs: CommonTypes.MessageTypes.MessageItemProps[]
  directMsgSent: boolean
}

// const peacenikmessagesTokens = localStorage.getItem('peacenikmessagesTokens') 
// let messagesTokensLocal
// if (peacenikmessagesTokens !== 'undefined' && peacenikmessagesTokens !== null) {
//   messagesTokensLocal = JSON.parse(peacenikmessagesTokens)?.tokens
// }
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
  directMsgRoomFriends: [],
  directPostToken: {
    host:"",
    token:""
  },
  directMsgs: [],
  directMsgSent:false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_DIRECT_MSG_UPLOAD_LINK_SUCCESS: {
      return {
        ...state,
        uploadLink: action.payload
      }
    }
    case Types.GET_FRIEND_MSG_API_DATA: {
      if ( action.payload.from || action.payload.count ) {
        return {
          ...state,
          isMoreMessagesRequested: true,
          isMessagesRequested: false
        }
      } else {
        return {
          ...state,
          isMoreMessagesRequested: false,
          isMessagesRequested: true
        }
      }
    }
    case Types.GET_FRIEND_MSG_SUCCESS: {
      let retObj
      if ( action.payload.reqData.from ){
        retObj = {
          ...state,
          directMsgs: uniqBy([
            ...state.directMsgs,
            ...action.payload.data
          ], 'msgId')
        }
      } else if (action.payload.reqData.count) {
        retObj = {
          ...state,
          directMsgs: uniqBy([
            ...action.payload.data,
            ...state.directMsgs
          ], 'msgId')
        }
      } else {
        retObj = {
          ...state,
          directMsgs: action.payload.data
        }
      }
      return retObj
    }
    case Types.SET_DIRECT_MSG_POST_TOKEN: {
      return {
        ...state,
        directPostToken: {
          host: action.payload.host,
          token: action.payload.token
        }
      }
    }
    case Types.SET_POST_MSG_TO_FRIEND_SUCCESS: {
      return {
        ...state, 
        directMsgSent: action.payload
      }
    }
    case Types.ADD_FRIENDS_TO_ROOM: {
      return {
        ...state, 
        directMsgRoomFriends: uniqBy([
          ...state.directMsgRoomFriends,
          ...action.payload
        ], 'id')
      }
    }
    case Types.ADD_FRIEND_TO_ROOM: {
      return {
        ...state, 
        directMsgRoomFriends: uniqBy([
          ...state.directMsgRoomFriends,
          action.payload
        ], 'id')
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
      const { usersLastMessage } = action.payload

      return {
        ...state, 
        usersLastMessage: usersLastMessage       
      }
      
    }
    default: return state
  }
}

export default reducer
