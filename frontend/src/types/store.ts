import { State as RegistrationState } from '@store/registration'
import { State as AuthorizationState } from '@store/authorization'
import { State as FriendsState } from '@store/friends'
import { State as CommonState } from '@store/common'
import { State as MessageHubsState } from '@store/hubs'
import { State as ProfileState } from '@store/profile'
import { State as FeedState } from '@store/feed'
import { State as NotificationsState } from '@store/notifications'
import { State as DashboardState } from '@store/dashboard'
import { State as GroupsState } from '@store/groups'

export interface StoreTypes {
  registration: RegistrationState
  authorization: AuthorizationState
  friends: FriendsState
  common: CommonState
  hubs: MessageHubsState
  profile: ProfileState
  feed: FeedState
  notifications: NotificationsState
  dashboard: DashboardState
  groups: GroupsState
}