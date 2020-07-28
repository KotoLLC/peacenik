import React from 'react'
import Friends from './Friends'
import Invitations from './Invitations'
import FriendInvite from './FriendInvite'
import FriendTabs from './Tabs'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'
import { Header } from '@view/shared/styles'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

export const FriendsPage: React.SFC<RouteComponentProps> = (props) => {

  return (
    <WithTopBar>
      <Header>
        <FriendTabs />
        <Tooltip title={`Send invitations`}>
          <IconButton color="primary" onClick={() => props.history.push('/friends/invite')}>
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
      </Header>
      <Switch>
        <Route path="/friends/all" exact component={Friends} />
        <Route path="/friends/invitations" exact component={Invitations} />
        <Route path="/friends/invite" exact component={FriendInvite} />
      </Switch>
    </WithTopBar>
  )
}