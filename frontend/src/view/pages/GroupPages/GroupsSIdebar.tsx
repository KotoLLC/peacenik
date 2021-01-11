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
      <SidebarItem to="/groups/public">PUBLIC GROUPS</SidebarItem>
      <SidebarItem exact to="/groups">MY GROUPS</SidebarItem>
      <SidebarButtonWrapper>
        <SidebarButton to="/groups/create">Create New Group</SidebarButton>
      </SidebarButtonWrapper>
    </SidebarWrapper>
  )
})