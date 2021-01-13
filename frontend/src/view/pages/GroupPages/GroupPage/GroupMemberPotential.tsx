import React from 'react'
import { Link } from 'react-router-dom'
import {
  GroupMemberWrapper,
  MemberAvatar,
  MemberName,
  MemberButtonOutlined,
  MemberNameWrapper,
} from './styles'

export const GroupMemberPotential = () => {

  return (
    <GroupMemberWrapper className="potential">
      <Link to={`/profile/user`}>
        <MemberAvatar className="potential" />
      </Link>
      <MemberNameWrapper>
        <MemberName className="potential" to={`/profile/user`}>Tillie Ross</MemberName>
        <MemberButtonOutlined className="small gray">Remove</MemberButtonOutlined>
      </MemberNameWrapper>
    </GroupMemberWrapper>
  )
}