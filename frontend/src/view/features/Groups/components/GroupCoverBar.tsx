import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ButtonOutlined, 
  CoverBarWrapper, 
  CoverBarContainer,
  CoverBarCounterWrapper,
  CoverBarCounter,
  CoverBarCounterName,
  CoverBarCounters,
} from '@view/shared/styles'

interface Props {
  groupId: string
  isAdminLayout: boolean
  membersCounter?: number
  invitesCounter?: number
  className?: string
}

const GroupCoverBar: React.FC<Props> = (props) => {
  const {
    membersCounter,
    invitesCounter,
    groupId,
    isAdminLayout,
    className,
  } = props


  if (isAdminLayout) {
    return (
      <CoverBarWrapper className={className}>
        <CoverBarContainer>
          <CoverBarCounters>
            <CoverBarCounterWrapper>
              <CoverBarCounterName>INVITES</CoverBarCounterName>
              <CoverBarCounter>{invitesCounter}</CoverBarCounter>
            </CoverBarCounterWrapper>
            <CoverBarCounterWrapper>
              <CoverBarCounterName>MEMBERS</CoverBarCounterName>
              <CoverBarCounter>{membersCounter}</CoverBarCounter>
            </CoverBarCounterWrapper>
          </CoverBarCounters>
          <Link to={`/groups/edit?id=${groupId}`}>
            <ButtonOutlined className="large">Edit group</ButtonOutlined>
          </Link>
        </CoverBarContainer>
      </CoverBarWrapper>
    )
  } else {
    return (
      <CoverBarWrapper className={className}>
        <CoverBarContainer>
        </CoverBarContainer>
      </CoverBarWrapper>
    )
  }
}

export default GroupCoverBar