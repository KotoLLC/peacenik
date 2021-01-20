import React from 'react'
import { Link } from 'react-router-dom'
import { 
  GroupHeader,
  HeaderContainer,
  HeaderCounterWrapper,
  HeaderCounter,
  HeaderCounterName,
  CountersWrapper,
  TopBarButtonOutlined,
} from './styles'

interface Props {
  membersCounter: number
  invitesCounter: number
  groupId: string
}

export const GroupTopBar: React.FC<Props> = (props) => {
  const { membersCounter, invitesCounter, groupId } = props

  return (
    <GroupHeader>
      <HeaderContainer>
        <CountersWrapper>
          <HeaderCounterWrapper>
            <HeaderCounterName>INVITES</HeaderCounterName>
            <HeaderCounter>{invitesCounter}</HeaderCounter>
          </HeaderCounterWrapper>
          <HeaderCounterWrapper>
            <HeaderCounterName>MEMBERS</HeaderCounterName>
            <HeaderCounter>{membersCounter}</HeaderCounter>
          </HeaderCounterWrapper>
        </CountersWrapper>
        <Link to={`/groups/edit?id=${groupId}`}>
          <TopBarButtonOutlined>Edit group</TopBarButtonOutlined>
        </Link>
      </HeaderContainer>
    </GroupHeader>
  )
}