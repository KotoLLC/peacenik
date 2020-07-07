
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
  }

}