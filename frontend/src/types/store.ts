import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'

export interface StoreTypes {
  authorization: AuthorizationState
  friends: FriendsState
}