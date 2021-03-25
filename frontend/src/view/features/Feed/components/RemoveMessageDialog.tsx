import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import MenuItem from '@material-ui/core/MenuItem'
import { ListItemTextStyled } from './styles'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'
import {
  ListItemIconStyled,
} from '@view/shared/styles'

interface Props {
  message: string
  id: string
  sourceHost: string

  onDeleteMessage: (data: ApiTypes.Feed.DeleteMessage) => void
}

const RemoveMessageDialog: React.SFC<Props> = (props) => {
  const [isOpen, setOpen] = React.useState(false)
  const { onDeleteMessage, id, sourceHost } = props

  const onRemove = () => {
    onDeleteMessage({
      host: sourceHost,
      body: {
        message_id: id
      }
    })
    setOpen(false)
  }

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <ListItemIconStyled>
          <DeleteIcon fontSize="small" />
        </ListItemIconStyled>
        <ListItemTextStyled primary="Delete" />
      </MenuItem>
      <ModalDialog
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}>
        <ModalSubTitle>You really want to remove this message?</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton onClick={() => setOpen(false)}>Cancel</ModalCancelButton>
          <ModalAllowButton onClick={onRemove}>Remove</ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type DispatchProps = Pick<Props, 'onDeleteMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteMessage: (data: ApiTypes.Feed.DeleteMessage) => dispatch(Actions.feed.deleteFeedMessageRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveMessageDialog)