import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'
import NotificationsList from './list'
import NotificationsInfo from './info'

export const NotificationsPage = () => (

  <WithTopBar>
    <Switch>
      <Route path="/notifications" exact component={NotificationsList} />
      <Route path="/notifications/info" exact component={NotificationsInfo} />
    </Switch>
  </WithTopBar>
)
