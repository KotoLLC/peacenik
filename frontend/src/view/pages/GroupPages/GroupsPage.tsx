import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { GroupsSidebar } from './GroupsSIdebar'
import { MyGroups } from './MyGroups'
import { PublicGroups } from './PublicGroups'
import { GroupsContainer } from './styles'

interface Props extends RouteComponentProps { }

export const GroupsPage: React.FC<Props> = (props) => {
  const { history } = props

  const goToGroupDetails = () => {
    history.push('/groups/details')
  }

  return (
    <GroupsContainer>
      <GroupsSidebar />
      <Switch>
        <Route path="/groups/my" exact component={MyGroups} />
        <Route path="/groups/public" exact component={PublicGroups} />
      </Switch>
    </GroupsContainer>
  )
} 