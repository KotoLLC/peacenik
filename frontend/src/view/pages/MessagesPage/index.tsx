import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MessageFeed from './MessageFeed'

export const MessagesPage = () => (
  <Switch>
    <Route path="/messages" exact component={MessageFeed} />
  </Switch>
)