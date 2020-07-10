import React from 'react'
import Friends from './Friends'
import FriendsOfFriends from './FriendsOfFriends'
import Invitations from './Invitations'
import FriendTabs from './Tabs'
import { Switch, Route } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'

export const FriendsPage = () => (
  <WithTopBar>
    <FriendTabs />
    <Switch>
      <Route path="/friends/all" exact component={Friends} />
      <Route path="/friends/potential" exact component={FriendsOfFriends} />
      <Route path="/friends/invitations" exact component={Invitations} />
    </Switch>
  </WithTopBar>
)