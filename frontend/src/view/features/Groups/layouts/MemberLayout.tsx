import React from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import GroupCoverBar from './../components/GroupCoverBar'
import { Member } from './../components/Member'
import { Owner } from './../components/Owner'
import { v4 as uuidv4 } from 'uuid'
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
import {
  GroupDescriptopn,
} from './../components/styles'

interface Props {
  groupDetails?: ApiTypes.Groups.GroupDetails | null
}

const MemberLayout: React.FC<Props> = React.memo((props) => {
  const { groupDetails } = props

  if (!groupDetails) return null

  const { group, members, status } = groupDetails

  return (
    <>
      <PageCover resource={getGroupCoverUrl(group?.id)} />
      <GroupCoverBar
        className="desktop-only"
        groupId={group?.id}
        isAdminLayout={false}
        memberStatus={status}
        isPublic={group?.is_public}
      />
      <Container>
        <PageColumnBarsWrapper>
          <LeftSideBar>
            <ProfileAvatar src={getGroupAvatarUrl(group?.id)} />
            <ProfileName>{group?.name}</ProfileName>
            <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
            <GroupDescriptopn>{group?.description}</GroupDescriptopn>
            <GroupCoverBar
              className="mobile-only"
              groupId={group?.id}
              isPublic={group?.is_public}
              isAdminLayout={false}
              memberStatus={status}
            />
          </LeftSideBar>
          <CentralBar>
            <PageBarTitle>Members ({members?.length})</PageBarTitle>
            {Boolean(members?.length) && members.map(item => (
              <Member
                groupId={group?.id}
                isAdminLayout={false}
                key={uuidv4()}
                {...item}
              />
            ))}
            {/* <ViewMoreButton>View more</ViewMoreButton> */}
          </CentralBar>
          <RightSideBar>
            <PageBarTitle>Owner</PageBarTitle>
            <Owner {...group.admin} />
          </RightSideBar>
        </PageColumnBarsWrapper>
      </Container>
    </>
  )
})

type StateProps = Pick<Props, 'groupDetails'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  groupDetails: selectors.groups.groupDetails(state),
})

export default connect(mapStateToProps, null)(MemberLayout)
