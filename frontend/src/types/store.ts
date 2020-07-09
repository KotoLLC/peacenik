import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'
import { State as NotifyState } from '@store/notify'
import { State as NodesState } from '@store/nodes'
import { State as ProfileState } from '@store/profile'

export interface StoreTypes {
  authorization: AuthorizationState
  friends: FriendsState
  notify: NotifyState
  nodes: NodesState
  profile: ProfileState
}