import React, { useState } from 'react'
import { CommonTypes, ApiTypes } from 'src/types'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'
import { DestroyHubButton } from './styles'

interface Props extends CommonTypes.HubTypes.Hub {
  onRemoveHub: (data: ApiTypes.Hubs.RemoveHub) => void
}

const RemoveHubDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const { onRemoveHub, domain, id } = props

  const onRemove = () => {
    onRemoveHub({ hub_id: id })
    setOpen(false)
  }

  return (
    <>
      <DestroyHubButton onClick={() => setOpen(true)}>Unlink/ Destroy hub</DestroyHubButton>
      <ModalDialog
        title="Destroy hub"
        isModalOpen={open}
        setOpenModal={() => setOpen(!open)}>
        <ModalSubTitle>You really want to remove <b>{domain}</b> hub?</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton
            onClick={() => setOpen(false)}>
            Cancel
          </ModalCancelButton>
          <ModalAllowButton
            onClick={onRemove}>
            Remove
          </ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type DispatchProps = Pick<Props, 'onRemoveHub'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRemoveHub: (data: ApiTypes.Hubs.RemoveHub) => dispatch(Actions.hubs.removeHubRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveHubDialog)