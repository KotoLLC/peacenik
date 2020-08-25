
export declare namespace ApiTypes {

  export interface RegisterUser {
    name: string
    email: string
    password: string
    invite_token?: string
  }

  export interface CheckUser {
    user_name: string
  }

  export interface Login {
    name: string
    password: string
  }

  export interface User {
    id: string
    name: string
    email: string
    is_confirmed?: boolean
  }

  export interface UploadLink {
    blob_id: string
    form_data: FormData
    link: string
  }

  export interface Token {
    token: string
  }

  export namespace Profile {

    export interface Avatar {
      form_data: FormData
      link: string
    }

    export interface UserProfile {
      user: User
      is_admin?: boolean
    }

    export interface EditProfile {
      email_changed?: boolean
      email?: string
      avatar_changed?: boolean
      avatar_id?: string
      password_changed?: boolean,
      current_password?: string,
      new_password?: string,
    }

    export interface UploadLinkRequest {
      content_type: string
      file_name: string
    }
  }

  export namespace Friends {

    export interface Friend {
      user: User
      friends: { 
        user: User 
        invite_status: InvitationStatus
      }[]
      invite_status: InvitationStatus
    }

    export interface Potential {
      user: User
      friends: User[]
      invite_status: InvitationStatus
    }

    export interface Request {
      friend: string
    }

    export type InvitationStatus = 'rejected' | 'pending' | 'accepted'

    export interface Invitation {
      friend_id: string
      friend_name: string
      created_at: string
      accepted_at?: string
      rejected_at?: string
    }

    export interface InvitationAccept {
      inviter_id: string
    }

    export interface InvitationReject {
      inviter_id: string
    }
  }

  export namespace Hubs {
    export interface Create {
      address: string
      details: string
      post_limit: number
    }

    export interface ApproveHub {
      hub_id: string
    }

    export interface RemoveHub {
      hub_id: string
    }

    export interface Hub {
      address: string
      created_at: string
      approved_at?: string
      details: string
      id: string
      user: User
    }
  }

  export namespace Messages {

    export interface PostMessage {
      host: string,
      body: {
        token: string,
        text: string,
        attachment_id?: string,
        attachment_changed?: boolean
      }
    }
    
    export interface PostComment {
      host: string,
      body: {
        token: string,
        text: string,
        message_id: string,
      }
    }
    
    export interface DeleteMessage {
      host: string,
      body: {
        message_id: string,
      }
    }
    
    export interface EditMessage {
      host: string,
      body: {
        message_id: string,
        text: string,
        text_changed: boolean,
        attachment_changed?: boolean,
        attachment_id?: string,
      }
    }
    
    export interface EditComment {
      host: string,
      body: {
        comment_id: string,
        text: string,
        text_changed: boolean
      }
    }
  
    export interface DeleteComment {
      host: string,
      body: {
        comment_id: string,
      }
    }

    export interface MessagesFromHub {
      host: string,
      body: {
        token: string
        count?: string
        from?: string
      }
    }

    export interface MessagesById {
      host: string,
      body: {
        token: string
        message_id: string
      }
    }

    export interface Message {
      sourceHost: string
      messageToken: string
      id: string
      text: string
      user_id: string
      user_name: string
      created_at: string
      updated_at: string
      comments?: Comment[] 
      liked_by?: LikeInfo[]
      attachment?: string
      attachment_type?: string
      attachment_thumbnail?: string
      likes?: number
      liked_by_me?: boolean
    }
    
    export interface Comment {
      sourceHost: string
      id: string
      text: string
      user_id: string
      user_name: string
      created_at: string
      updated_at: string
      likes?: number
      liked_by_me?: boolean
    }

    export interface UploadLinkRequest {
      host: string,
      content_type: string
      file_name: string
    }

    export interface Attachment {
      form_data: FormData
      link: string
    }

    export interface Like {
      host: string
      id: string
    }

    export interface LikeInfo {
      user_id: string
      user_name: string
      liked_at: string
    }

    export interface LikesInfoData {
      id: string
      likes: LikeInfo[]
    }
  }

  export namespace Notifications {
 
    export type MessageTypes = 'message/post' | 'message/tag' | 'message/like'
    export type CommentTypes = 'comment/post' | 'comment/tag' | 'comment/like'
    export type HubTypes = 'message-hub/add' | 'message-hub/approve' | 'message-hub/remove'
    export type InviteTypes = 'invite/add' | 'invite/approve' | 'invite/reject'

    export interface Data {
      user_id: string
      hub_id?: string
      message_id?: string
      comment_id?: string
    }

    export type Type = MessageTypes | CommentTypes | HubTypes | InviteTypes

    export interface Notification {
      id: string,
      text: string,
      type: Type
      data: Data
      created_at: string
    }
  }
}
