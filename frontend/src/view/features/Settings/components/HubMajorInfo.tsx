import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, CommonTypes } from 'src/types'
import {
  HubSettingsBlock,
  CircleIconWrapper,
  HubName,
  HubStatus,
  HubPath,
  HubLinkWrapper,
} from './styles'
import AirplanIcon from '@assets/images/airplan-icon.svg'

interface Props extends CommonTypes.HubTypes.Hub {
  currentHub: CommonTypes.HubTypes.CurrentHub
  isConnectionError: boolean
}

const HubMajorInfo: React.FC<Props> = React.memo((props) => {
  const { domain, aproved, currentHub, isConnectionError } = props

  console.log(props)
  
  const checkHub = () => {
    if (domain) {
      return (
        <>
          <HubName>Your hub</HubName>
          <HubLinkWrapper>
            {domain && <HubPath>{domain}</HubPath>}
          </HubLinkWrapper>
          <HubStatus>Status:
            {!isConnectionError ? <span className="online">online</span> : <span>offline</span>}
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
            {!isConnectionError ? <span className="online">online</span> : <span>offline</span>}
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

type StateProps = Pick<Props, 'isConnectionError'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isConnectionError: selectors.common.isConnectionError(state),
})

export default connect(mapStateToProps)(HubMajorInfo)