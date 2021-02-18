import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import {
  MemberHeaderSidebar,
  MemberNameWrapperSidebar,
  MemberButtonsWrapperSidebar,
} from './styles'

import {
  UsersListItemWrapper,
  UsersListItemAvatar,
  UsersListItemFullName,
  ButtonContained,
} from '@view/shared/styles' 

interface Props extends ApiTypes.Friends.Friend {
  groupId: string
  onAddUserToGroup: (data: ApiTypes.Groups.AddUserToGroup) => void
}

const UserForInvite: React.FC<Props> = (props) => {
  const [isRequested, setRequested] = useState<boolean>(false)
  
  const {
    user,
    groupId,
    onAddUserToGroup,
  } = props

  const data = {
    group_id: groupId,
    user: user.id
  }

  const onInvite = () => {
    onAddUserToGroup(data)
    setRequested(true)
  }

  return (
    <UsersListItemWrapper className="sidebar">
      <MemberHeaderSidebar>
        <Link to={`/profile/user?id=${user.id}`}>
          <UsersListItemAvatar src={getAvatarUrl(user.id)} className="sidebar" />
        </Link>
        <MemberNameWrapperSidebar>
          <UsersListItemFullName
            className="sidebar"
            to={`/profile/user?id=${user.id}`}>
            {user.full_name || user.name}
          </UsersListItemFullName>
        </MemberNameWrapperSidebar>
      </MemberHeaderSidebar>
      <MemberButtonsWrapperSidebar>
        <ButtonContained 
          onClick={onInvite}
          disabled={isRequested} 
          className="small">
          Invite
        </ButtonContained>
      </MemberButtonsWrapperSidebar>
    </UsersListItemWrapper>
  )
}

type DispatchProps = Pick<Props, 'onAddUserToGroup'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAddUserToGroup: (data: ApiTypes.Groups.AddUserToGroup) => dispatch(Actions.groups.addUserToGroupRequest(data)),
})

export default connect(null, mapDispatchToProps)(UserForInvite)
