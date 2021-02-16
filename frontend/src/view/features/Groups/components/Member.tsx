import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import DeleteMemberDialog from './DeleteMemberDialog'
import {
  MemberWrapper,
  MemberAvatar,
  MemberName,
} from './styles'

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
    <MemberWrapper>
      <Link to={`/profile/user?id=${id}`}>
        <MemberAvatar src={getAvatarUrl(id)} />
      </Link>
      <MemberName to={`/profile/user?id=${id}`}>{full_name || name}</MemberName>
      {isAdminLayout && <DeleteMemberDialog groupId={groupId} memberId={id} />}
    </MemberWrapper>
  )
}