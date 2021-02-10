import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HubCreationPage from './HubCreationPage'
import HubListPage from './HubListPage'
import HubTabs from './Tabs'

export const HubPages = () => (
  <>
    <HubTabs />
    <Switch>
      <Route path="/hubs" exact component={HubCreationPage} />
      <Route path="/hubs/list" exact component={HubListPage} />
    </Switch>
  </>
)