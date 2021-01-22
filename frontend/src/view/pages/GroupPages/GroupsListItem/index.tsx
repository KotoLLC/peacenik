import React from 'react'
import { Link } from 'react-router-dom'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { ButtonContained, ButtonOutlined } from '@view/shared/styles'
import { ApiTypes, StoreTypes } from 'src/types'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
// import Actions from '@store/actions'
import JoinGroupDialog from './JoinGroupDialog'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  AvatarStyled,
  GroupName,
  GroupNameLink,
  GroupCounter,
  GroupPublicity,
  GroupDescription,
  NoButton,
} from './styles'

interface Props extends ApiTypes.Groups.RecievedGroup {
  userId?: string
}

const GroupsListItem: React.FC<Props> = React.memo((props) => {
  const { group, status, userId } = props
  const { avatar_original, description, id, is_public, name, admin } = group

  const renderCurrentButton = () => {
    if (userId === admin.id) {
      return (
        <Link to={`/groups/edit?id=${id}`}>
          <ButtonOutlined className="extra-small">Edit group</ButtonOutlined>
        </Link>
      )
    }

    if (userId !== admin.id && status === '') {
      return <JoinGroupDialog groupId={id} />
    }

    if (userId !== admin.id && status === 'pending') {
      return <ButtonOutlined className="extra-small">Remove invite</ButtonOutlined>
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
          {/* {status === 'member' ?
            <Link to={`/groups/group?id=${id}`}>
              <AvatarStyled>
                <img src={AvatarIcon} alt="icon" />
              </AvatarStyled>
            </Link> :
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
          } */}
          {renderCurrentButton()}
        </ItemHeader>
        <GroupNameLink to={`/groups/group?id=${id}`}>{name}</GroupNameLink> 
        {/* {status === 'member' ?
          <GroupNameLink to={`/groups/group?id=${id}`}>{name}</GroupNameLink> :
          <GroupName>{name}</GroupName>
        } */}
        <GroupCounter>123 participants</GroupCounter>
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

export default connect(mapStateToProps, null)(GroupsListItem)
