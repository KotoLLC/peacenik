import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  MemberHeaderSidebar,
  MemberNameWrapperSidebar,
} from './styles'
import {
  UsersListItemWrapper,
  UsersListItemAvatar,
  UsersListItemFullName,
} from '@view/shared/styles'

interface Props extends ApiTypes.Groups.GroupAdmin {}

export const Owner: React.FC<Props> = (props) => {
  const { full_name, id, name } = props

  return (
    <UsersListItemWrapper className="sidebar">
      <MemberHeaderSidebar>
        <Link to={`/profile/user?id=${id}`}>
          <UsersListItemAvatar src={getAvatarUrl(id)} className="sidebar" />
        </Link>
        <MemberNameWrapperSidebar>
          <UsersListItemFullName
            className="sidebar"
            to={`/profile/user?id=${id}`}>
            {full_name || name}
          </UsersListItemFullName>
        </MemberNameWrapperSidebar>
      </MemberHeaderSidebar>
    </UsersListItemWrapper>
  )
}
