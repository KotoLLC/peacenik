import React from 'react'
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
} from './styles'

interface Props {
  name: string
  fullName: string
  id: string
}

export const FriendItem: React.FC<Props> = (props) => {
  const { name, fullName, id } = props
  
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
        <FriendsButtonOutlined className="grey">Unfriend</FriendsButtonOutlined>
        <FriendsButtonOutlined>Send message</FriendsButtonOutlined>
      </ButtonGroup>
    </FriendCard>
  )
}
