import React from 'react'
import { GroupsListItem } from './GroupsListItem'
import { GroupsListWrappe } from './styles'

export const MyGroups = () => {
  return (
    <GroupsListWrappe>
      <GroupsListItem/>
      <GroupsListItem/>
    </GroupsListWrappe>
  )
}