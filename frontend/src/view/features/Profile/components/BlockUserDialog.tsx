import React from 'react'
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
  isOpen: boolean

  setOpen: (value: boolean) => void
  onDisableUser: (value: string) => void
  callback?: () => void
}

const BlockUserDialog: React.FC<Props> = (props) => {
  const { onDisableUser, setOpen, userId, callback, isOpen } = props

  const onBlock = () => {
    onDisableUser(userId)

    if (callback) {
      callback()
    }
  }

  return (
    <ModalDialog
      title="WARNING!"
      isModalOpen={isOpen}
      setOpenModal={() => setOpen(!isOpen)}
      >
      <ModalSubTitle>
        Blocking a user is permanent. There is no way to un-block them. This means you will not be able to see
        them in any friend lists, read their comments, invite them to be friends, or receive invitations from
        them. Your profile will also be hidden from them.
        </ModalSubTitle>
      <ModalButtonsGroup>
        <ModalCancelButton
          className="grey"
          onClick={() => setOpen(false)}>
          Cancel
          </ModalCancelButton>
        <ModalAllowButton
          onClick={onBlock}>
          Block
        </ModalAllowButton>
      </ModalButtonsGroup>
    </ModalDialog>
  )
}

type DispatchProps = Pick<Props, 'onDisableUser'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDisableUser: (value: string) => dispatch(Actions.profile.disableUserRequest(value)),
})

export default connect(null, mapDispatchToProps)(BlockUserDialog)