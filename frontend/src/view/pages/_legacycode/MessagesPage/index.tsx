import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MessageFeed from './MessageFeed'

export const MessagesPage = () => (
  <Switch>
    <Route path="/feed" exact component={MessageFeed} />
  </Switch>
)