import React from 'react'
import { Link } from 'react-router-dom'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import { ButtonOutlined } from '@view/shared/styles'
import { ApiTypes, StoreTypes } from 'src/types'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import JoinGroupDialog from './../components/JoinGroupDialog'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  GroupItemAvatar,
  GroupNameLink,
  GroupCounter,
  ItemsGroupPublicity,
  GroupDescription,
  NoButton,
} from './../components/styles'

interface Props extends ApiTypes.Groups.RecievedGroup {
  userId?: string
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => void
}

const GroupsListItem: React.FC<Props> = React.memo((props) => {
  const { group, status, userId, onDeleteJoinRequest } = props
  const { description, id, is_public, name, admin, member_count } = group

  const renderCurrentButton = () => {
    if (userId === admin.id) {
      return (
        <Link to={`/groups/edit?id=${id}`}>
          <ButtonOutlined className="extra-small">Edit group</ButtonOutlined>
        </Link>
      )
    }

    if (userId !== admin.id) {
      if (status === '' || status === 'rejected') {
        return <JoinGroupDialog
          groupId={id}
          buttonClassName="extra-small"
          buttonText="Join"
        />
      }
      if (status === 'pending') {
        return <ButtonOutlined
          className="extra-small"
          onClick={() => onDeleteJoinRequest({
            group_id: id
          })}>
          Remove invite
        </ButtonOutlined>
      } else return <NoButton />
    } else return <NoButton />
  }

  return (
    <GroupsListItemWrapper>
      <ItemCover resource={getGroupCoverUrl(id!)} />
      <ItemContentWraper>
        <ItemHeader>
          <Link to={`/groups/group?id=${id}`}>
            <GroupItemAvatar src={getGroupAvatarUrl(id)}>
              <CameraAltIcon />
            </GroupItemAvatar>
          </Link>
          {renderCurrentButton()}
        </ItemHeader>
        <GroupNameLink to={`/groups/group?id=${id}`}>{name}</GroupNameLink>
        <GroupCounter>{member_count} participants</GroupCounter>
        <ItemsGroupPublicity>{is_public ? 'Public' : 'Private'} {userId === admin.id && '- My group'}</ItemsGroupPublicity>
        <GroupDescription>{description}</GroupDescription>
      </ItemContentWraper>
    </GroupsListItemWrapper>
  )
})

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onDeleteJoinRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => dispatch(Actions.groups.deleteJoinRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupsListItem)
