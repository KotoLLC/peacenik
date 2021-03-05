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
import { CommonTypes } from 'src/types'

interface Props extends CommonTypes.HubTypes.Hub { }

export const HubMajorInfo: React.FC<Props> = React.memo((props) => {
  const { domain, aproved } = props

  return (
    <HubSettingsBlock>
      <CircleIconWrapper>
        <img src={AirplanIcon} alt="icon" />
      </CircleIconWrapper>
      <HubName>Your hub</HubName>
      <HubLinkWrapper>
        {domain && <HubALink href={domain}>{domain}</HubALink>}
      </HubLinkWrapper>
      <HubStatus>Status:
        {aproved ? <span className="online">online</span> : <span>offline</span>}
      </HubStatus>
    </HubSettingsBlock>
  )
})