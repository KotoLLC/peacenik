import { State as RegistrationState } from '@store/registration'
import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'
import { State as CommonState } from '@store/common'
import { State as MessageHubsState } from '@store/message-hubs'
import { State as ProfileState } from '@store/profile'
import { State as MessagesState } from '@store/messages'
import { State as NotificationsState } from '@store/notifications'

export interface StoreTypes {
  registration: RegistrationState
  authorization: AuthorizationState
  friends: FriendsState
  common: CommonState
  messageHubs: MessageHubsState
  profile: ProfileState
  messages: MessagesState
  notifications: NotificationsState
}