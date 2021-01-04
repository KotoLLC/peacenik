import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import NotificationsList from './list'
import NotificationsInfo from './info'

export const NotificationsPage = () => (

  <PageLayout>
    <Switch>
      <Route path="/notifications" exact component={NotificationsList} />
      <Route path="/notifications/info" exact component={NotificationsInfo} />
    </Switch>
  </PageLayout>
)
