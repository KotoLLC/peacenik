import React from 'react'
import {
  HubSettingsBlock,
  CircleIconWrapper,
  HubName,
  HubStatus,
  HubALink,
  HubLinkWrapper,
} from './styles'
import AirplanIcon from '@assets/images/airplan-icon.svg'

export const HubMajorInfo = React.memo(() => {
  return (
    <HubSettingsBlock>
      <CircleIconWrapper>
        <img src={AirplanIcon} alt="icon" />
      </CircleIconWrapper>
      <HubName>Your hub</HubName>
      <HubLinkWrapper>
        <HubALink href="https://myhub.com">https://myhub.com</HubALink>
      </HubLinkWrapper>
      <HubStatus>Status: <span className="online">online</span></HubStatus>
    </HubSettingsBlock>
  )
})