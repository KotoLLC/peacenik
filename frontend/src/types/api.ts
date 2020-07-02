
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

  export interface FriendRequest {
    friend: string
  }

}