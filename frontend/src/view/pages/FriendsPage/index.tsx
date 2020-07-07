import React, { useState } from 'react'
import Friends from './Friends'
import FriendsOfFriends from './FriendsOfFriends'
import Invitations from './Invitations'
import { Tabs } from './Tabs'
import { FriendTypes } from '../../../types'

import { Header } from './styles'

export const FriendsPage = () => {
  const [currentTab, onTabSwitch] = useState<FriendTypes.CurrentTab>('friends')

  const renderCurrentTab = () => {

    switch (currentTab) {
      case 'friends': return <Friends/>
      case 'friends-of-friends': return <FriendsOfFriends/>
      case 'invitations': return <Invitations/>
      default: return <Friends/>
    }
  }

  return (
    <>
      <Header>
        <Tabs onTabClick={onTabSwitch} />
      </Header>
      {renderCurrentTab()}
    </>
  )
}