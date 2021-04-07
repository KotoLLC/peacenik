import { ApiTypes } from 'src/types'

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
}