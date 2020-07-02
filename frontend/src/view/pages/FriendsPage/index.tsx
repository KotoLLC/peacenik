import React, { useState } from 'react'
import Friends from './Friends'
import FriendsOfFriends from './FriendsOfFriends'
import Invitations from './Invitations'
import { Tabs } from './Tabs'
import TopBar from '@view/shared/TopBar'
import { FriendsTypes } from '../../../types'

import {
  PageWrapper,
  Header,
} from './styles'

export const FriendsPage = () => {
  const [currentTab, onTabSwitch] = useState<FriendsTypes.CurrentTab>('friends')

  const renderCurrentTab = () => {

    switch (currentTab) {
      case 'friends': return <Friends/>
      case 'friends-of-friends': return <FriendsOfFriends/>
      case 'invitations': return <Invitations/>
      default: return <Friends/>
    }
  }

  return (
    <PageWrapper>
      <TopBar />
      <Header>
        <Tabs onTabClick={onTabSwitch} />
      </Header>
      {renderCurrentTab()}
    </PageWrapper>
  )
}