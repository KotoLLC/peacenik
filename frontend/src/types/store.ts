import { State as RegistrationState } from '@store/registration'
import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'
import { State as CommonState } from '@store/common'
import { State as NodesState } from '@store/nodes'
import { State as ProfileState } from '@store/profile'
import { State as MessagesState } from '@store/messages'

export interface StoreTypes {
  registration: RegistrationState
  authorization: AuthorizationState
  friends: FriendsState
  common: CommonState
  nodes: NodesState
  profile: ProfileState
  messages: MessagesState
}