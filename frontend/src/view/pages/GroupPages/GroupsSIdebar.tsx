import React from 'react'
import {
  SidebarWrapper,
  SidebarItem,
  SidebarButtonWrapper,
  SidebarButton,
} from './styles'

export const GroupsSidebar = React.memo(() => {
  return (
    <SidebarWrapper>
      <SidebarItem exact to="/groups">PUBLIC GROUPS</SidebarItem>
      <SidebarItem to="/groups/my">MY GROUPS</SidebarItem>
      <SidebarButtonWrapper>
        <SidebarButton to="/groups/create">Create New Group</SidebarButton>
      </SidebarButtonWrapper>
    </SidebarWrapper>
  )
})