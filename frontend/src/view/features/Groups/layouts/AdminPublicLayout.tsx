import React, { useEffect, useState } from 'react'
import GroupCoverBar from '../components/GroupCoverBar'
import { Member } from '../components/Member'
import MemberInvited from '../components/MemberInvited'
import DeleteGroupDialog from '../components/DeleteGroupDialog'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
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
  // ViewMoreButton,
} from '../components/styles'

interface Props {
  groupDetails?: ApiTypes.Groups.GroupDetails | null
  invitesToConfirm: ApiTypes.Groups.InviteToConfirm[]

  onGetInvitesToConfirmRequest: () => void
}

const AdminPublicLayout: React.FC<Props> = React.memo((props) => {
  const [groupInvites, setGroupInvites] = useState<ApiTypes.Groups.Invite[] | null>(null)
  const [isRequested, setRequested] = useState(false)
  const { groupDetails, onGetInvitesToConfirmRequest } = props

  useEffect(() => {
    if (groupInvites === null && !isRequested) {
      onGetInvitesToConfirmRequest()
      setRequested(true)
    }

    if (groupDetails?.invites?.length && isRequested) {
      setGroupInvites(fixInvitesGroupId())
      setRequested(false)
    }
  }, [groupInvites, isRequested])

  const fixInvitesGroupId = () => {
    if (!groupDetails?.invites?.length) return []

    return groupDetails?.invites?.map(item => {
      item.group_id = groupDetails?.group?.id
      return item
    })
  }

  if (!groupDetails) return null

  const { group, members, status, invites } = groupDetails

  return (
    <>
      <PageCover resource={getGroupCoverUrl(group?.id)} />
      <GroupCoverBar
        className="desktop-only"
        memberStatus={status}
        membersCounter={members?.length}
        invitesCounter={invites?.length || 0}
        groupId={group?.id}
        isAdminLayout={true}
        isPublic={group?.is_public}
      />
      <Container>
        <PageColumnBarsWrapper>
          <LeftSideBar>
            <ProfileAvatar src={getGroupAvatarUrl(group?.id)} />
            <ProfileName>{group?.name}</ProfileName>
            <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
            <GroupDescriptopn>{group?.description}</GroupDescriptopn>
            <DeleteGroupDialog
              className="desktop-only"
              groupId={group?.id}
            />
            <GroupCoverBar
              className="mobile-only"
              memberStatus={status}
              membersCounter={members?.length}
              invitesCounter={invites?.length || 0}
              groupId={group?.id}
              isAdminLayout={true}
              isPublic={group?.is_public}
            />
          </LeftSideBar>
          <CentralBar>
            <PageBarTitle>Members ({members?.length})</PageBarTitle>
            {Boolean(members?.length) && members.map(item => (
              <Member
                groupId={group?.id}
                isAdminLayout={true}
                key={uuidv4()}
                {...item}
              />
            ))}
            {/* <ViewMoreButton>View more</ViewMoreButton> */}
          </CentralBar>
          <RightSideBar>
            <PageBarTitle>Waiting for approval ({invites?.length || 0})</PageBarTitle>
            {Boolean(invites?.length) && invites?.map(item => <MemberInvited
              key={uuidv4()}
              {...item}
            />)}
          </RightSideBar>
          <DeleteGroupDialog
            className="mobile-only"
            groupId={group?.id}
          />
        </PageColumnBarsWrapper>
      </Container>
    </>
  )
})

type StateProps = Pick<Props, 'groupDetails' | 'invitesToConfirm'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  groupDetails: selectors.groups.groupDetails(state),
  invitesToConfirm: selectors.groups.invitesToConfirm(state),
})

type DispatchProps = Pick<Props, 'onGetInvitesToConfirmRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetInvitesToConfirmRequest: () => dispatch(Actions.groups.getInvitesToConfirmRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPublicLayout)
