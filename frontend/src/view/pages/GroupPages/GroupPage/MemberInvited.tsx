import React from 'react'
import { Link } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ButtonOutlined, ButtonContained } from '@view/shared/styles'
import {
  MemberWrapper,
  MemberAvatar,
  MemberName,
  MemberInvitedHeader,
  MemberInvitedNameWrapper,
  MemberInvitedMessage,
  MemberInvitedButtonsWrapper,
} from './styles'

interface Props extends ApiTypes.Groups.Invite {
  calback?: (data: ApiTypes.Groups.ConfirmDenyInvite) => void
  onConfirmInvite: (data: ApiTypes.Groups.ConfirmDenyInvite) => void
  onDenyInvite: (data: ApiTypes.Groups.ConfirmDenyInvite) => void
}

const MemberInvited: React.FC<Props> = (props) => {
  const {
    group_id,
    inviter_id,
    invited_name,
    invited_full_name,
    message,
    invited_id,
    onDenyInvite,
    onConfirmInvite,
    calback,
  } = props

  const data = {
    group_id,
    inviter_id,
    invited_id,
  }

  const onDeny = () => {
    onDenyInvite(data)
    calback && calback(data)
  }

  const onConfirm = () => {
    onConfirmInvite(data)
    calback && calback(data)
  }

  return (
    <MemberWrapper className="potential">
      <MemberInvitedHeader>
        <Link to={`/profile/user`}>
          <MemberAvatar src={getAvatarUrl(invited_id)} className="potential" />
        </Link>
        <MemberInvitedNameWrapper>
          <MemberName
            className="potential"
            to={`/profile/user`}>
            {invited_full_name || invited_name}
          </MemberName>
          <MemberInvitedMessage>{message}</MemberInvitedMessage>
        </MemberInvitedNameWrapper>
      </MemberInvitedHeader>
      <MemberInvitedButtonsWrapper>
        <ButtonOutlined onClick={onDeny} className="small gray">Ignore</ButtonOutlined>
        <ButtonContained onClick={onConfirm} className="small">Approve</ButtonContained>
      </MemberInvitedButtonsWrapper>
    </MemberWrapper>
  )
}

type DispatchProps = Pick<Props, 'onConfirmInvite' | 'onDenyInvite'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onConfirmInvite: (data: ApiTypes.Groups.ConfirmDenyInvite) => dispatch(Actions.groups.confirmInviteRequest(data)),
  onDenyInvite: (data: ApiTypes.Groups.ConfirmDenyInvite) => dispatch(Actions.groups.denyInviteRequest(data)),
})

export default connect(null, mapDispatchToProps)(MemberInvited)
