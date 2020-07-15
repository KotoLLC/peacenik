
export declare namespace ApiTypes {

  export interface Login {
    name: string
    password: string
  }

  export interface User {
    id: string
    name: string
  }

  export namespace Friends {
    export interface Potential {
      user: User
      friends: User[]
      invite_status: InvitationStatus
    }

    export interface Request {
      friend: string
    }

    export type InvitationStatus = 'rejected' | 'pending'

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

  export namespace Nodes {
    export interface Create {
      address: string
      details: string
    }

    export interface ApproveNode {
      node_id: string
    }

    export interface RemoveNode {
      node_id: string
    }

    export interface Node {
      address: string
      created_at: string
      approved_at?: string
      details: string
      id: string
      user: User
    }
  }

  export interface Profile {
    user: User
    is_admin?: boolean
  }

  export interface Token {
    [key: string]: string
  }

  export namespace Messages {

    export interface PostMessage {
      host: string,
      body: {
        token: string,
        text: string,
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
      }
    }

    export interface MessagesFromNode {
      host: string,
      body: {
        token: string,
      }
    }

    export interface Message {
      sourceHost: string
      id: string
      text: string
      user_id: string
      user_name: string
      created_at: string
      updated_at: string
    }
  }

}