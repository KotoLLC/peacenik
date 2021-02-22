import React from 'react'
import { ApiTypes } from 'src/types'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'

interface Props {
  userId: string
  userName: string
  isOpen: boolean

  setOpen: (value: boolean) => void
  onRejectInvitation: (value: ApiTypes.Friends.InvitationReject) => void
}

const RemoveFriendDialog: React.SFC<Props> = (props) => {
  const {
    isOpen,
    setOpen,
    onRejectInvitation,
    userId,
    userName,
  } = props

  const onRemove = () => {
    onRejectInvitation({ inviter_id: userId })
    setOpen(false)
  }

  return (
    <ModalDialog
      title="Remove"
      isModalOpen={isOpen}
      setOpenModal={() => setOpen(!isOpen)}
    >
      <ModalSubTitle>
        Are you sure you'd like to remove <b>@{userName}</b> from your friend's list?
      </ModalSubTitle>
      <ModalButtonsGroup>
        <ModalCancelButton
          className="grey"
          onClick={() => setOpen(false)}>
          Cancel
          </ModalCancelButton>
        <ModalAllowButton
          onClick={onRemove}>
          Remove
        </ModalAllowButton>
      </ModalButtonsGroup>
    </ModalDialog>
  )
}

type DispatchProps = Pick<Props, 'onRejectInvitation'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRejectInvitation: (data: ApiTypes.Friends.InvitationReject) => dispatch(Actions.friends.rejectInvitationRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveFriendDialog)