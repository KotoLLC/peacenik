import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import { GroupsPage } from './GroupsPage'
import { CreateGroupPage } from './CreateGroupPage'
import { GroupDetailsPage } from './GroupDetailsPage'

export const GroupPages = () => {
  return (
    <PageLayout>
      <Router>
        <Route path="/groups" component={GroupsPage} />
        <Route path="/groups/create" exact component={CreateGroupPage} />
        <Route path="/groups/details" exact component={GroupDetailsPage} />
      </Router>
    </PageLayout>
  )
}
