import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MessageHubCreationPage from './MessageHubCreationPage'
import MessageHubListPage from './MessageHubListPage'
import MessageHubTabs from './Tabs'
import { WithTopBar } from '@view/shared/WithTopBar'

export const MessageHubPages = () => (
  <WithTopBar>
    <MessageHubTabs />
    <Switch>
      <Route path="/message-hubs/create" exact component={MessageHubCreationPage} />
      <Route path="/message-hubs/list" exact component={MessageHubListPage} />
    </Switch>
  </WithTopBar>
)