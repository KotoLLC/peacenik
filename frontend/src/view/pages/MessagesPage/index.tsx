import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'
import { Messages } from './Messages'

export const MessagesPage = () => (
  <WithTopBar>
    <Switch>
      <Route path="/messages" exact component={Messages} />
    </Switch>
  </WithTopBar>
)