import React from 'react'
import { Link } from 'react-router-dom'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  UsersListItemWrapper,
  UsersListItemAvatar,
  UsersListItemFullName,
  UsersListHeaderSidebar,
  UsersListNameWrapperSidebar,
} from '@view/shared/styles'

interface Props {
  fullName: string
  name: string
  id: string
}

export const ProfileCommonFriend: React.FC<Props> = (props) => {
  const { fullName, name, id } = props

  return (
    <UsersListItemWrapper className="sidebar">
      <UsersListHeaderSidebar>
        <Link to={`/profile/user?id=${id}`}>
          <UsersListItemAvatar src={getAvatarUrl(id)} className="sidebar" />
        </Link>
        <UsersListNameWrapperSidebar>
          <UsersListItemFullName
            className="sidebar"
            to={`/profile/user?id=${id}`}>
            {fullName ? fullName : `@${name}`}
          </UsersListItemFullName>
        </UsersListNameWrapperSidebar>
      </UsersListHeaderSidebar>
    </UsersListItemWrapper>
  )
}