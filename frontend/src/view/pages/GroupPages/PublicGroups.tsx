import React from 'react'
import { GroupsListItem } from './GroupsListItem'
import { GroupsListWrappe } from './styles'

export const PublicGroups = () => {
  return (
    <GroupsListWrappe>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
      <GroupsListItem/>
    </GroupsListWrappe>
  )
}