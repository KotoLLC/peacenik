import React from 'react'
import {
  HubSettingsBlock,
  CircleIconWrapper,
  HubName,
  HubStatus,
  HubPath,
  HubLinkWrapper,
} from './styles'
import AirplanIcon from '@assets/images/airplan-icon.svg'
import { CommonTypes } from 'src/types'

interface Props extends CommonTypes.HubTypes.Hub {
  currentHub: CommonTypes.HubTypes.CurrentHub
}

export const HubMajorInfo: React.FC<Props> = React.memo((props) => {
  const { domain, aproved, currentHub } = props

  const checkHub = () => {
    if (domain) {
      return (
        <>
          <HubName>Your hub</HubName>
          <HubLinkWrapper>
            {domain && <HubPath>{domain}</HubPath>}
          </HubLinkWrapper>
          <HubStatus>Status:
            {aproved ? <span className="online">online</span> : <span>offline</span>}
          </HubStatus>
        </>
      )
    } else {
      return (
        <>
          <HubName>Current hub</HubName>
          <HubLinkWrapper>
            {currentHub?.host && <HubPath>{currentHub?.host}</HubPath>}
          </HubLinkWrapper>
          <HubStatus>Status:
            {currentHub?.host ? <span className="online">online</span> : <span>offline</span>}
          </HubStatus>
        </>
      )
    }
  }

  return (
    <HubSettingsBlock>
      <CircleIconWrapper>
        <img src={AirplanIcon} alt="icon" />
      </CircleIconWrapper>
      {checkHub()}
    </HubSettingsBlock>
  )
})