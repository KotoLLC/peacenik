import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { ButtonContained } from '@view/shared/styles'
import {
  FriendsTabsWrapper,
  FriendsTabs,
  FriendsTab,
} from './styles'

const FriendTabs: React.SFC<RouteComponentProps> = React.memo((props) => {
  const [currentTab, onTabChange] = useState<number | boolean>(0)
  const { history, location } = props

  useEffect(() => {
    if (location.pathname.indexOf('all') !== -1) {
      onTabChange(0)
    }

    if (location.pathname.indexOf('invitations') !== -1) {
      onTabChange(1)
    }
    if (location.pathname.indexOf('invite') !== -1) {
      onTabChange(false)
    }
  }, [location.pathname])

  return (
    <FriendsTabsWrapper>
      <FriendsTabs
        value={currentTab}
        onChange={(event, newTab) => onTabChange(newTab)}
        centered>
        <FriendsTab label="Friends (0)" onClick={() => history.push('/friends/all')} />
        <FriendsTab label="Invites (0)" onClick={() => history.push('/friends/invitations')} />
      </FriendsTabs>
      <ButtonContained className="large mobile-none">Invite friends</ButtonContained>
    </FriendsTabsWrapper>
  )
})

export default withRouter(FriendTabs)