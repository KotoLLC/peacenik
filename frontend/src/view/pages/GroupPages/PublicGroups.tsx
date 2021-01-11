import React from 'react'
import { GroupsListItem } from './GroupsListItem'
import { GroupsListWrapper } from './styles'

export const PublicGroups = () => {
  return (
    <GroupsListWrapper>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
    </GroupsListWrapper>
  )
}