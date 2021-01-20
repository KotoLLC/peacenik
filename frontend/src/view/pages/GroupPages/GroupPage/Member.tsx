import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  MemberWrapper,
  MemberAvatar,
  MemberName,
  MemberButtonOutlined,
} from './styles'

interface Props extends ApiTypes.Groups.GroupMember {}

export const Member: React.FC<Props> = (props) => {
  const { full_name, name, id, is_confirmed } = props

  return (
    <MemberWrapper>
      <Link to={`/profile/user?id=${id}`}>
        <MemberAvatar src={getAvatarUrl(id)} />
      </Link>
      <MemberName to={`/profile/user?id=${id}`}>{full_name || name}</MemberName>
      {/* <MemberButtonOutlined className="gray">Remove</MemberButtonOutlined> */}
    </MemberWrapper>
  )
}