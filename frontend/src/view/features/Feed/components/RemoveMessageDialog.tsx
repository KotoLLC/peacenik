import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import {
  ListItemIconStyled,
  DialogTextWrapper,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'
import { CroppedText } from './styles'

interface Props {
  message: string
  id: string
  sourceHost: string

  onDeleteMessage: (data: ApiTypes.Messages.DeleteMessage) => void
}

const RemoveMessageDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { message, onDeleteMessage, id, sourceHost } = props

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
    <div>
      <MenuItem onClick={() => setOpen(true)}>
        <ListItemIconStyled>
          <DeleteIcon fontSize="small" />
        </ListItemIconStyled>
        <ListItemText primary="Delete" />
      </MenuItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">You really want to remove this message?</DialogTitleStyled>
        <DialogContentStyled>
          <DialogTextWrapper>
            <CroppedText>{message}</CroppedText>
          </DialogTextWrapper>
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

type DispatchProps = Pick<Props, 'onDeleteMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteMessage: (data: ApiTypes.Messages.DeleteMessage) => dispatch(Actions.messages.deleteMessageRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveMessageDialog)