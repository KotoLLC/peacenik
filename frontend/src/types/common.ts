import { 
  ApiTypes  
} from 'src/types'
import {
  MessageDirection,
  MessagePublishStatus,
  MessageContentType
} from './enum'

import { Url } from "url";

export declare namespace CommonTypes {

  export namespace HubTypes {

    export interface Hub {
      domain: string, 
      author: string, 
      created: string, 
      aproved: string, 
      description: string,
      id: string
    }
  
    export interface CurrentHub {
      host: string,
      token: string,
    }

    export type CreationStatus = 'pending' | 'approved' | ''
  }

  export namespace NotificationTypes {
    
    export interface LastKnown {
      host?: string
      id: string
    }
  }

  export namespace GroupTypes{
    export interface GroupMsgToken {
      host: string
      token: string
    }
  }

  export namespace MessageTypes{
    export interface MessageItemProps {
      msgId: string;
      direction: MessageDirection;
      actionTime: string;
      status: MessagePublishStatus;
      contentType: MessageContentType;
      messeageContent: string | Url;
    }
  }
  
  export interface UserNameData {
    userName: string
    userFullName: string
    userId: string
  }

  export interface PopupData {
    created_at: string
    message: ApiTypes.Feed.Message | null
    isAttacmentDeleted: boolean
    attachment_type: string
    attachment: string
    comments: string[]
    sourceHost: string | string[] | null | undefined
    messageToken: string | string[] | null | undefined
    id: string
    user_id: string
    friends: ApiTypes.Friends.Friend[] | null
  }

  export interface FriendCounterData {
    last_message_time: string
    total_comment_count: number
    total_count: number
    unread_comment_count: number
    unread_count: number
  }
  
  export interface MessageRoomFriendData {
    id: string
    fullName: string
    accessTime
  }

  export interface TokenData {
    host: string
    token: string
  }
}