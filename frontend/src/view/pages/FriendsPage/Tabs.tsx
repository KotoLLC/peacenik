import React, { useState, useEffect } from 'react'
import Actions from '@store/actions'
import { withRouter, RouteComponentProps } from 'react-router'
import { ButtonContained } from '@view/shared/styles'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import selectors from '@selectors/index'

import {
  FriendsTabsWrapper,
  FriendsTabs,
  FriendsTab,
} from './styles'

interface Props extends RouteComponentProps {
  friends: ApiTypes.Friends.Friend[]
  invitations: ApiTypes.Friends.Invitation[]

  onOpenInvitationsDialog: (value: boolean) => void
}

const FriendTabs: React.FC<Props> = React.memo((props) => {
  const [currentTab, onTabChange] = useState<number | boolean>(0)
  const { history, location, friends, invitations, onOpenInvitationsDialog } = props

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
        <FriendsTab label={`Friends (${friends?.length})`} onClick={() => history.push('/friends/all')} />
        <FriendsTab label={`Invites (${invitations?.length})`} onClick={() => history.push('/friends/invitations')} />
      </FriendsTabs>
      <ButtonContained 
        className="large mobile-none"
        onClick={() => onOpenInvitationsDialog(true)}>
          Invite friends
        </ButtonContained>
    </FriendsTabsWrapper>
  )
})

type StateProps = Pick<Props, 'friends' | 'invitations'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
  invitations: selectors.friends.invitations(state)
})

type DispatchProps = Pick<Props, 'onOpenInvitationsDialog'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onOpenInvitationsDialog: (value: boolean) => dispatch(Actions.friends.openInvitationsDialog(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FriendTabs))