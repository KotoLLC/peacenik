import React from 'react'
import { PageLayout } from '@view/shared/PageLayout'
import { GroupTopBar } from './GroupTopBar'
import { GroupMember } from './GroupMember'
import { GroupMemberPotential } from './GroupMemberPotential'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import DeleteGroupDialog from './DeleteGroupDialog'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import {
  GroupCover,
  GroupContainer,
  GroupMainWrapper,
  LeftSideBar,
  RightSideBar,
  CentralBar,
  AvatarStyled,
  GroupName,
  GroupPublicity,
  GroupDescriptopn,
  BarTitle,
  ViewMoreButton,
} from './styles'

interface Props {
  groupDetails?: ApiTypes.Groups.GroupDetails | null
}

const AdminLauout: React.FC<Props> = (props) => {
  const { groupDetails } = props

  if (!groupDetails) return null

  const { group, members } = groupDetails

  return (
    <PageLayout>
      <GroupCover />
      <GroupTopBar membersCounter={members?.length} invitesCounter={0} groupId={group?.id} />
      <GroupContainer>
        <GroupMainWrapper>
          <LeftSideBar>
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
            <GroupName>{group?.name}</GroupName>
            <GroupPublicity>{group?.is_public ? 'Public' : 'Private'} group</GroupPublicity>
            <GroupDescriptopn>{group?.description}</GroupDescriptopn>
            <DeleteGroupDialog groupId={group?.id} />
          </LeftSideBar>
          <CentralBar>
            <BarTitle>Members ({members?.length})</BarTitle>
            {/* {members?.length && members.map(item => <GroupMember {...item) />)} */}
            {/* <ViewMoreButton>View more</ViewMoreButton> */}
          </CentralBar>
          <RightSideBar>
            <BarTitle>Waiting for approval (14)</BarTitle>
            {/* <GroupMemberPotential /> */}
            {/* <ViewMoreButton>View more</ViewMoreButton> */}
          </RightSideBar>
        </GroupMainWrapper>
      </GroupContainer>
    </PageLayout>
  )
}

type StateProps = Pick<Props, 'groupDetails'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  groupDetails: selectors.groups.groupDetails(state),
})

// type DispatchProps = Pick<Props, 'onGetGroupDetailsRequest'>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
//   onGetGroupDetailsRequest: (value: string) => dispatch(Actions.groups.getGroupDetailsRequest(value)),
// })

export default connect(mapStateToProps, null)(AdminLauout)
