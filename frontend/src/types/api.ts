
export declare namespace ApiTypes {

  export interface RegisterUser {
    name: string
    full_name: string
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
    remember_me?: boolean
  }

  export interface ForgotPassword {
    name: string
    email: string
  }

  export interface ForgotUserName {
    email: string
  }

  export interface ResetPassword {
    reset_token: string
    new_password: string
    name: string
  }

  export interface User {
    id: string
    name: string
    email: string
    full_name: string
    is_confirmed?: boolean
    invite_status?: Friends.InvitationStatus
    hide_identity: boolean
    hide_identity_changed?: boolean
  }

  export interface UploadLink {
    blob_id: string
    form_data: FormData
    link: string
  }

  export interface UploadLinkRequest {
    content_type: string
    file_name: string
  }

  export interface Attachment {
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
      groups: Groups.RecievedGroup[]
    }

    export interface EditProfile {
      email_changed?: boolean
      email?: string
      avatar_changed?: boolean
      avatar_id?: string
      full_name?: string
      full_name_changed?: string
      password_changed?: boolean,
      current_password?: string,
      new_password?: string,
      background_changed?: boolean
      background_id?: string
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
      group_count: number
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

    export type InvitationStatus = 'rejected' | 'pending' | 'accepted' | ''

    export interface Invitation {
      friend_id: string
      friend_name: string
      friend_full_name: string
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

  export namespace Feed {

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

    export interface ReportMessageHub {
      host: string,
      body: {
        message_id: string,
        report: string
      }
    }

    export interface ReportMessageCentral {
      hub_id: string,
      report_id: string
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
	      friend_id?: string
      }
    }

    export interface MessagesById {
      host: string,
      body: {
        token: string
        message_id: string
      }
    }

    export interface MessagesByGroupId {
      host: string,
      body: {
        token: string
        group_id: string
      }
    }

    export interface Message {
      sourceHost: string
      messageToken: string
      id: string
      text: string
      user_id: string
      user_name: string
      user_full_name: string
      created_at: string
      updated_at: string
      comments?: Comment[]
      liked_by?: LikeInfo[]
      attachment?: string
      attachment_type?: string
      attachment_thumbnail?: string
      likes?: number
      liked_by_me?: boolean
      friend_id?: string
    }

    export interface Comment {
      sourceHost: string
      id: string
      text: string
      user_id: string
      user_name: string
      user_full_name: string
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
      unlike?: boolean
    }

    export interface Hide {
      host: string
      id: string
    }

    export interface LikeInfo {
      user_id: string
      user_name: string
      user_full_name: string
      liked_at: string
    }

    export interface LikesInfoData {
      id: string
      likes: LikeInfo[]
    }
  }
  export namespace Messages {
    export interface UserMessage {
      user_id: string
      messages: Feed.Message[]
      lastMessageDate?: string | null
    }  
  }

  export namespace ChatMessages {
    
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
      read_at: string
      created_at: string
      sourceHost: string
      messageToken: string
    }
  }

  export namespace Dashboard {

    export interface ObjectionableContent {
      attachment: string
      attachment_thumbnail: string
      attachment_type: string
      author_id: string
      author_name: string
      created_at: string
      id: string
      message_id: string
      report: string
      reporter_id: string
      reporter_name: string
      resolved_at: string
      text: string
      sourceHost: string
    }

    export interface ResolveReport {
      host: string,
      body: {
        report_id: string,
      }
    }

    export interface DeleteReportedMessage {
      host: string,
      body: {
        report_id: string,
      }
    }

    export interface EjectUser {
      host: string,
      user_id: string,
      report_id: string
    }
  }

  export namespace Groups {

    export type MemberStatus = 'member' | 'pending' | 'rejected' | ''

    export interface AddGroup {
      name: string
      description: string
      is_public: boolean
      avatar_id?: string
      background_id?: string
    }
    
    export interface EditGroup {
      group_id: string
      description_changed: boolean
      description: string
      avatar_changed: boolean
      avatar_id: string
      is_public_changed?: boolean
      is_public?: boolean
      background_changed: boolean
      background_id: string
    }

    export interface GroupAdmin {
      avatar_original: string
      email: string
      full_name: string
      id: string
      is_confirmed: boolean
      name: string
    }

    export interface Group {
      admin: GroupAdmin
      avatar_original: string
      description: string
      id: string
      is_public: boolean
      name: string
      member_count: number
    }
    
    export interface GroupDetails {
      group: Group
      members: GroupMember[]
      invites: Invite[]
      status: MemberStatus
    }

    export interface GroupMember {
      avatar_original: string
      email: string
      full_name: string
      id: string
      is_confirmed: boolean
      name: string
    }

    export interface RecievedGroup {
      group: Group
      status: MemberStatus
    }
    
    export interface RequestJoin {
      group_id: string
      message: string
    }
    
    export interface Invite {
      accepted_at: string
      accepted_by_admin_at: string
      created_at: string
      group_description: string
      group_id: string
      group_name: string
      invited_full_name: string
      invited_id: string
      invited_name: string
      inviter_full_name: string
      inviter_id: string
      inviter_name: string
      message: string
      rejected_at: string
      rejected_by_admin_at: string
    }

    export interface InviteToConfirm {
      group: {
        avatar_original: string
        description: string
        id: string
        is_public: boolean
        name: string
      }
      invites: Invite[]
    }

    export interface ConfirmDenyInvite {
      group_id: string
      inviter_id: string
      invited_id: string
    }
    
    export interface DeleteMember {
      group_id: string
      user_id: string
    }
    
    export interface DeleteJoinRequest {
      group_id: string
    }

    export interface UploadLinkRequest {
      content_type: string
      file_name: string
    }

    export interface Image {
      form_data: FormData
      link: string
    }

    export interface AddUserToGroup {
      group_id: string
      user: string
    }
    
  }
}
