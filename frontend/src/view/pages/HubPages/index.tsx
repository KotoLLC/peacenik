import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HubCreationPage from './HubCreationPage'
import HubListPage from './HubListPage'
import HubTabs from './Tabs'
import { PageLayout } from '@view/shared/PageLayout'

export const HubPages = () => (
  <PageLayout>
    <HubTabs />
    <Switch>
      <Route path="/hubs/create" exact component={HubCreationPage} />
      <Route path="/hubs/list" exact component={HubListPage} />
    </Switch>
  </PageLayout>
)