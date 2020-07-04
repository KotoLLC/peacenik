
export declare namespace ApiTypes {

  export interface Login {
    name: string
    password: string
  }

  export interface User {
    id: string
    name: string
  }

  export interface FriendsOfFriend {
    user: User
    friends: User[]
  }

  export interface Invitation {
    friend_id: string
    friend_name: string
    created_at: string
    accepted_at?: string
    rejected_at?: string
  }
  
  export interface AcceptInvitation {
    inviter_id: string
  }
  
  export interface RejectInvitation {
    inviter_id: string
  }

  export interface FriendRequest {
    friend: string
  }
}