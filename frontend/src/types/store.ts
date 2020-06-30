import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'
import { State as NotifyState } from '@store/notify'

export interface StoreTypes {
  authorization: AuthorizationState
  friends: FriendsState
  notify: NotifyState
}