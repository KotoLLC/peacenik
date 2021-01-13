import React from 'react'
import { Link } from 'react-router-dom'
import {
  GroupMemberWrapper,
  MemberAvatar,
  MemberName,
  MemberButtonOutlined,
} from './styles'

export const GroupMember = () => {

  return (
    <GroupMemberWrapper>
      <Link to={`/profile/user`}>
        <MemberAvatar />
      </Link>
      <MemberName to={`/profile/user`}>Tillie Ross</MemberName>
      <MemberButtonOutlined className="gray">Remove</MemberButtonOutlined>
    </GroupMemberWrapper>
  )
}