import React from 'react'
import {
  SidebarWrapper,
  SidebarItem,
} from '@view/shared/styles'

export const SettingsSidebar = React.memo((props) => {

  return (
    <SidebarWrapper>
      <SidebarItem exact to="/settings">Profile</SidebarItem>
      <SidebarItem to="/settings/hub">Message hub</SidebarItem>
    </SidebarWrapper>
  )
})