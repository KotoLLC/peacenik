import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotificationsList from './list'
import NotificationsInfo from './info'

export const NotificationsPage = () => (
  <Switch>
    <Route path="/notifications" exact component={NotificationsList} />
    <Route path="/notifications/info" exact component={NotificationsInfo} />
  </Switch>
)
