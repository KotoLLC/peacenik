import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled, PaperStyled } from './styles'
import { GroupsPage } from './GroupsPage'
import { CreateGroup } from './CreateGroup'

export const GroupPages = () => {
  return (
    <WithTopBar>
      <ContainerStyled>
        <PaperStyled>
          <Switch>
            <Route path="/groups" exact component={GroupsPage} />
            <Route path="/groups/create" exact component={CreateGroup} />
          </Switch>
        </PaperStyled>
      </ContainerStyled>
    </WithTopBar>
  )
}
