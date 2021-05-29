import React from 'react'
import { SettingsContainer, SettingsContentWrapper } from './../components/styles'
import { SettingsSidebar } from './../components/SettingsSidebar'

export const SettingsLayout = (props) => {
  return (
    <SettingsContainer>
      <SettingsSidebar />
      <SettingsContentWrapper>
        {props.children}
      </SettingsContentWrapper>
    </SettingsContainer>
  )
}