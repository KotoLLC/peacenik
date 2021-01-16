import React from 'react'
import { Link } from 'react-router-dom'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { ButtonContained, ButtonOutlined } from '@view/shared/styles'
import { ApiTypes, StoreTypes } from 'src/types'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
// import Actions from '@store/actions'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  AvatarStyled,
  GroupName,
  GroupCounter,
  GroupPublicity,
  GroupDescription,
} from './styles'

interface Props extends ApiTypes.Groups.RecievedGroup {
  userId?: string
}

const GroupsListItem: React.FC<Props> = React.memo((props) => {
  const { group, status, userId } = props
  const { avatar_original, description, id, is_public, name, admin } = group

  const renderCurrentButton = () => {
    if (userId === admin.id) {
      return <ButtonOutlined className="extra-small">Edit group</ButtonOutlined>
    }

    if (userId !== admin.id && status === '') {
      return <ButtonContained className="extra-small">Join</ButtonContained>
    }

    if (userId !== admin.id && status === 'member') {
      return <ButtonContained className="extra-small">Remove invite</ButtonContained>
    }
  }

  return (
    <GroupsListItemWrapper>
      <ItemCover style={{ backgroundImage: avatar_original }} />
      <ItemContentWraper>
        <ItemHeader>
          <Link to="/groups/group">
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
          </Link>
          {renderCurrentButton()}
        </ItemHeader>
        <GroupName to={`/groups/group?id=${id}`}>{name}</GroupName>
        <GroupCounter>123 participants</GroupCounter>
        <GroupPublicity>{is_public ? 'Public' : 'Private'}</GroupPublicity>
        <GroupDescription>{description}</GroupDescription>
      </ItemContentWraper>
    </GroupsListItemWrapper>
  )
})

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

// type DispatchProps = Pick<Props, 'onGetMyGroupsRequest'>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
//   onGetMyGroupsRequest: () => dispatch(Actions.groups.getMyGroupsRequest()),
// })

export default connect(mapStateToProps, null)(GroupsListItem)
