import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import { v4 as uuidv4 } from 'uuid'
import UserCoverBar from './../components/UserCoverBar'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import {
  Container,
  PageCover,
  ProfileAvatar,
  LeftSideBar,
  RightSideBar,
  CentralBar,
  PageColumnBarsWrapper,
  PageBarTitle,
  ProfileName,
  ProfileNote,
} from '@view/shared/styles'

interface Props {
}

const UserProfilePage: React.FC<Props> = React.memo((props) => {

  return (
    <>
      <PageCover resource={getGroupCoverUrl('')} />
      <UserCoverBar
        className="desktop-only"
      />
      <Container>
        <PageColumnBarsWrapper>
          <LeftSideBar>
            <ProfileAvatar src={getGroupAvatarUrl('')} />
            <ProfileName>Profile Name</ProfileName>
            <ProfileNote>Profile Note</ProfileNote>
            <UserCoverBar
              className="mobile-only"
            />
          </LeftSideBar>
          <CentralBar>
            <PageBarTitle>Content</PageBarTitle>
          </CentralBar>
          <RightSideBar>
            <PageBarTitle>Content</PageBarTitle>
          </RightSideBar>
        </PageColumnBarsWrapper>
      </Container>
    </>
  )
})

// type StateProps = Pick<Props, 'groupDetails' | 'friends'>
// const mapStateToProps = (state: StoreTypes): StateProps => ({
//   groupDetails: selectors.groups.groupDetails(state),
//   friends: selectors.friends.friends(state),
// })

// type DispatchProps = Pick<Props, 'onGetInvitesToConfirmRequest' | 'onGetFriends'>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
//   onGetInvitesToConfirmRequest: () => dispatch(Actions.groups.getInvitesToConfirmRequest()),
//   onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(AdminPrivateLayout)
export default connect()(UserProfilePage)
