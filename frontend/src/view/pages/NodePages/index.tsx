import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NodeCreationPage from './NodeCreationPage'
import NodeListPage from './NodeListPage'
import NodeTabs from './Tabs'
import { WithTopBar } from '@view/shared/WithTopBar'

export const NodePages = () => (
  <WithTopBar>
    <NodeTabs />
    <Switch>
      <Route path="/nodes/create" exact component={NodeCreationPage} />
      <Route path="/nodes/list" exact component={NodeListPage} />
    </Switch>
  </WithTopBar>
)