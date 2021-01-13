import React from 'react'
import { 
  GroupHeader,
  HeaderContainer,
  HeaderCounterWrapper,
  HeaderCounter,
  HeaderCounterName,
  CountersWrapper,
  TopBarButtonOutlined,
} from './styles'

export const GroupTopBar = () => {
  return (
    <GroupHeader>
      <HeaderContainer>
        <CountersWrapper>
          <HeaderCounterWrapper>
            <HeaderCounterName>INVITES</HeaderCounterName>
            <HeaderCounter>14</HeaderCounter>
          </HeaderCounterWrapper>
          <HeaderCounterWrapper>
            <HeaderCounterName>MEMBERS</HeaderCounterName>
            <HeaderCounter>300</HeaderCounter>
          </HeaderCounterWrapper>
        </CountersWrapper>
        <TopBarButtonOutlined>Edit group</TopBarButtonOutlined>
      </HeaderContainer>
    </GroupHeader>
  )
}