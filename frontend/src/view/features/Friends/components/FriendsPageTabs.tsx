import React from 'react'
import { 
  PageTabsWrapper, 
  PageTab,
} from './styles'

export const FriendsPageTabs = () => (
    <PageTabsWrapper>
      <PageTab to="/friends">FRIENDS</PageTab>
      <PageTab to="/feed">MESSAGES</PageTab>
    </PageTabsWrapper>
)
