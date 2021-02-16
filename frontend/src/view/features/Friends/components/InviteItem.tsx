import React from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes } from 'src/types'
import { Link } from 'react-router-dom'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  FriendCard,
  UserInfo,
  UserInfoText,
  UserInfoDisplayName,
  UserInfoDisplayEmail,
  ButtonGroup,
  AvatarStyled,
  FriendsButtonOutlined,
  FriendsButtonContained,
} from './styles'

interface Props {
  name: string
  fullName: string
  id: string

  onAcceptInvitation: (data: ApiTypes.Friends.InvitationAccept) => void
  onRejectInvitation: (data: ApiTypes.Friends.InvitationReject) => void
}

const InviteItem: React.FC<Props> = (props) => {
  const { name, fullName, id, onAcceptInvitation, onRejectInvitation } = props

  return (
    <FriendCard>
      <UserInfo>
        <Link to={`/profile/user?id=${id}`} >
          <AvatarStyled alt={name} src={getAvatarUrl(id)}/>
        </Link>
        <UserInfoText>
          <UserInfoDisplayName to={`/profile/user?id=${id}`} >{fullName || name}</UserInfoDisplayName>
          <UserInfoDisplayEmail>@{name}</UserInfoDisplayEmail>
        </UserInfoText>
      </UserInfo>
      <ButtonGroup>
        <FriendsButtonOutlined 
          onClick={() => onRejectInvitation({ inviter_id: id })}
          className="grey">
          Ignore
        </FriendsButtonOutlined>
        <FriendsButtonContained
          onClick={() => onAcceptInvitation({ inviter_id: id })}>
          Add friend
        </FriendsButtonContained>
      </ButtonGroup>
    </FriendCard>
  )
}

type DispatchProps = Pick<Props, 'onAcceptInvitation' | 'onRejectInvitation'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAcceptInvitation: (data: ApiTypes.Friends.InvitationAccept) => dispatch(Actions.friends.acceptInvitationRequest(data)),
  onRejectInvitation: (data: ApiTypes.Friends.InvitationReject) => dispatch(Actions.friends.rejectInvitationRequest(data))
})

export default connect(null, mapDispatchToProps)(InviteItem)