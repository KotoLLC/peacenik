import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'
import MessageFeed from './MessageFeed'

export const MessagesPage = () => (
  <WithTopBar>
    <Switch>
      <Route path="/messages" exact component={MessageFeed} />
    </Switch>
  </WithTopBar>
)