import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CreateGroupPage from './../pages/CreateGroupPage'
import EditGroupPage from './../pages/EditGroupPage'
import GroupPage from './../pages/GroupPage'
import MyGroupsListPage from './../pages/MyGroupsListPage'
import PublicGroupsListPage from './../pages/PublicGroupsListPage'

const GroupsPages: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/groups" component={PublicGroupsListPage} />
      <Route path="/groups/public" component={PublicGroupsListPage} />
      <Route path="/groups/my" component={MyGroupsListPage} />
      <Route path="/groups/group" component={GroupPage} />
      <Route path="/groups/create" component={CreateGroupPage} />
      <Route path="/groups/edit" component={EditGroupPage} />
    </Switch>
  )
}

export default GroupsPages