import { Types } from './actions'
import { CommonTypes, ApiTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'

export interface State  {
  isGroupAddedSuccessfully: boolean
  isGroupEditedSuccessfully: boolean
  isGroupDeletedSuccessfully: boolean
  isMemberDeletedSuccessfully: boolean
  joinToGroupRequestSuccessfully: boolean
  isGroupLeavedSuccess: boolean
  publicGroups: ApiTypes.Groups.RecievedGroup[]
  myGroups: ApiTypes.Groups.RecievedGroup[]
  currentGroupId: string
  groupDetails: ApiTypes.Groups.GroupDetails | null
  invitesToConfirm: ApiTypes.Groups.InviteToConfirm[]
  coverUploadLink: ApiTypes.UploadLink | null
  avatarUploadLink: ApiTypes.UploadLink | null
  groupMessages: any
  groupMessageToken: CommonTypes.GroupTypes.GroupMsgToken
}

const initialState: State = {
  isGroupAddedSuccessfully: false,
  isGroupEditedSuccessfully: false,
  isGroupDeletedSuccessfully: false,
  isMemberDeletedSuccessfully: false,
  joinToGroupRequestSuccessfully: false,
  isGroupLeavedSuccess: false,
  publicGroups: [],
  myGroups: [],
  currentGroupId: '',
  groupDetails: null,
  invitesToConfirm: [],
  coverUploadLink: null,
  avatarUploadLink: null,
  groupMessages: [],
  groupMessageToken: {
    host: "",
    token: ""
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ADD_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupAddedSuccessfully: action.payload
        }
      }
    }
    case Types.EDIT_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupEditedSuccessfully: action.payload
        }
      }
    }
    case Types.GET_PUBLIC_GROUPS_SUCCESS: {
      return {
        ...state, ...{
          publicGroups: action.payload
        }
      }
    }
    case Types.GET_MY_GROUPS_SUCCESS: {
      return {
        ...state, ...{
          myGroups: action.payload
        }
      }
    }
    case Types.GET_GROUP_DETAILS_SUCCESS: {
      return {
        ...state, ...{
          groupDetails: action.payload
        }
      }
    }
    case Types.DELETE_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupDeletedSuccessfully: action.payload
        }
      }
    }
    case Types.JOIN_TO_GROUP_SUCCESS: {
      return {
        ...state, ...{
          joinToGroupRequestSuccessfully: action.payload
        }
      }
    }
    case Types.GET_INVITES_TO_CONFIRM_SUCCESS: {
      return {
        ...state, ...{
          invitesToConfirm: action.payload
        }
      }
    }
    case Types.DELETE_MEMBER_SUCCESS: {
      return {
        ...state, ...{
          isMemberDeletedSuccessfully: action.payload
        }
      }
    }
    case Types.LEAVE_GROUP_SUCCESS: {
      return {
        ...state, ...{
          isGroupLeavedSuccess: action.payload
        }
      }
    }
    case Types.SET_CURRENT_GROUP_ID: {
      return {
        ...state, ...{
          currentGroupId: action.payload
        }
      }
    }
    case Types.GET_GROUP_COVER_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{ coverUploadLink: action.payload }
      }
    }
    case Types.GET_AVATAR_UPLOAD_LINK_SUCCESS: {
      return {
        ...state, ...{ avatarUploadLink: action.payload }
      }
    }
    case Types.GET_GROUP_FEED_SUCCESS: {
      const { messages } = action.payload
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
    default: return state
  }
}

export default reducer
