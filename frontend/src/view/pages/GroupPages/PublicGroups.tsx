import React from 'react'
import { GroupsListItem } from './GroupsListItem'
import { GroupsSidebar } from './GroupsSIdebar'
import { GroupsContainer, GroupsListWrapper } from './styles'
import { PageLayout } from '@view/shared/PageLayout'

export const PublicGroups = () => {
  return (
    <PageLayout>
      <GroupsContainer>
        <GroupsSidebar />
        <GroupsListWrapper>
          <GroupsListItem />
          <GroupsListItem />
          <GroupsListItem />
          <GroupsListItem />
          <GroupsListItem />
        </GroupsListWrapper>
      </GroupsContainer>
    </PageLayout>
  )
}