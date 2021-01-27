import React from 'react'
import Friends from './Friends'
import Invitations from './Invitations'
import FriendInvite from './FriendInvite'
import FriendTabs from './Tabs'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import { PageNavigation } from './PageNavigation'
import { FriendsWrapper } from './styles'

export const FriendsPage: React.SFC<RouteComponentProps> = (props) => {
  return (
    <PageLayout>
      <PageNavigation />
      <FriendsWrapper>
        <FriendTabs />
        <Switch>
          <Route path="/friends" exact component={Friends} />
          <Route path="/friends/all" exact component={Friends} />
          <Route path="/friends/invitations" exact component={Invitations} />
          <Route path="/friends/invite" exact component={FriendInvite} />
        </Switch>
      </FriendsWrapper>
    </PageLayout>
  )
}