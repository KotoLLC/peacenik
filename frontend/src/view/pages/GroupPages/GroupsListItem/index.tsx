import React from 'react'
import { Link } from 'react-router-dom'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { ButtonContained, ButtonOutlined } from '@view/shared/styles'
import { ApiTypes, StoreTypes } from 'src/types'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import JoinGroupDialog from '../GroupPage/JoinGroupDialog'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  AvatarStyled,
  GroupNameLink,
  GroupCounter,
  GroupPublicity,
  GroupDescription,
  NoButton,
} from './styles'

interface Props extends ApiTypes.Groups.RecievedGroup {
  userId?: string

  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => void
}

const GroupsListItem: React.FC<Props> = React.memo((props) => {
  const { group, status, userId, onDeleteJoinRequest } = props
  const { avatar_original, description, id, is_public, name, admin, member_count } = group

  const renderCurrentButton = () => {
    if (userId === admin.id) {
      return (
        <Link to={`/groups/edit?id=${id}`}>
          <ButtonOutlined className="extra-small">Edit group</ButtonOutlined>
        </Link>
      )
    }

    if (userId !== admin.id && status === '') {
      return <JoinGroupDialog
        groupId={id}
        buttonClassName="extra-small"
        buttonText="Join"
      />
    }

    if (userId !== admin.id && status === 'pending') {
      return <ButtonOutlined 
        className="extra-small" 
        onClick={() => onDeleteJoinRequest({
          group_id: id,
          inviter_id: '',
        })}>
          Remove invite
        </ButtonOutlined>
    } else return <NoButton />
  }

  return (
    <GroupsListItemWrapper>
      <ItemCover style={{ backgroundImage: avatar_original }} />
      <ItemContentWraper>
        <ItemHeader>
          <Link to={`/groups/group?id=${id}`}>
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
          </Link>
          {renderCurrentButton()}
        </ItemHeader>
        <GroupNameLink to={`/groups/group?id=${id}`}>{name}</GroupNameLink>
        <GroupCounter>{member_count} participants</GroupCounter>
        <GroupPublicity>{is_public ? 'Public' : 'Private'} {userId === admin.id && '- My group'}</GroupPublicity>
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
