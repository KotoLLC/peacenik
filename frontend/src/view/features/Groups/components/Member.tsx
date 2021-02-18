import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import DeleteMemberDialog from './DeleteMemberDialog'
import {
  UsersListItemWrapper,
  UsersListItemAvatar,
  UsersListItemFullName,
} from '@view/shared/styles' 

interface Props extends ApiTypes.Groups.GroupMember {
  isAdminLayout: boolean
  groupId: string
}

export const Member: React.FC<Props> = (props) => {
  const {
    full_name,
    name,
    id,
    is_confirmed,
    isAdminLayout,
    groupId,
  } = props

  return (
    <UsersListItemWrapper>
      <Link to={`/profile/user?id=${id}`}>
        <UsersListItemAvatar src={getAvatarUrl(id)} />
      </Link>
      <UsersListItemFullName to={`/profile/user?id=${id}`}>{full_name || name}</UsersListItemFullName>
      {isAdminLayout && <DeleteMemberDialog groupId={groupId} memberId={id} />}
    </UsersListItemWrapper>
  )
}