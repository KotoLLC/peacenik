import React from 'react'
import Friends from './Friends'
import Invitations from './Invitations'
import FriendInvite from './FriendInvite'
import FriendTabs from './Tabs'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import { Header } from '@view/shared/styles'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import Button from '@material-ui/core/Button'

export const FriendsPage: React.SFC<RouteComponentProps> = (props) => {

  return (
    <PageLayout>
      <Header>
        <FriendTabs />
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.history.push('/friends/invite')}
          startIcon={<GroupAddIcon/>}
        >Invite friend
      </Button>
      </Header>
      <Switch>
        <Route path="/friends/all" exact component={Friends} />
        <Route path="/friends/invitations" exact component={Invitations} />
        <Route path="/friends/invite" exact component={FriendInvite} />
      </Switch>
    </PageLayout>
  )
}