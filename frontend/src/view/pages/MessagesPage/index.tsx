import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import MessageFeed from './MessageFeed'

export const MessagesPage = () => (
  <PageLayout>
    <Switch>
      <Route path="/messages" exact component={MessageFeed} />
    </Switch>
  </PageLayout>
)