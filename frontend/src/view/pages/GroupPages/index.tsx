import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import { ContainerStyled, PaperStyled } from './styles'
import { GroupsPage } from './GroupsPage'
import { CreateGroupPage } from './CreateGroupPage'
import { GroupDetailsPage } from './GroupDetailsPage'

export const GroupPages = () => {
  return (
    <PageLayout>
      <ContainerStyled>
        <PaperStyled>
          <Switch>
            <Route path="/groups" exact component={GroupsPage} />
            <Route path="/groups/create" exact component={CreateGroupPage} />
            <Route path="/groups/details" exact component={GroupDetailsPage} />
          </Switch>
        </PaperStyled>
      </ContainerStyled>
    </PageLayout>
  )
}
