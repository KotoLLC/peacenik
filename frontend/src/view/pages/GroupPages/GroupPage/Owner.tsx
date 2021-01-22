import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  MemberWrapper,
  MemberAvatar,
  MemberName,
  MemberHeaderSidebar,
  MemberNameWrapperSidebar,
} from './styles'

interface Props extends ApiTypes.Groups.GroupAdmin {}

export const Owner: React.FC<Props> = (props) => {
  const { full_name, id, name } = props

  return (
    <MemberWrapper className="sidebar">
      <MemberHeaderSidebar>
        <Link to={`/profile/user?id=${id}`}>
          <MemberAvatar src={getAvatarUrl(id)} className="sidebar" />
        </Link>
        <MemberNameWrapperSidebar>
          <MemberName
            className="sidebar"
            to={`/profile/user?id=${id}`}>
            {full_name || name}
          </MemberName>
        </MemberNameWrapperSidebar>
      </MemberHeaderSidebar>
    </MemberWrapper>
  )
}
