import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
// import { NodeTypes, ApiTypes } from '../../../types'
// import Actions from '@store/actions'
import {
  DialogTextWrapper,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'
import { CroppedText } from './styles'

interface Props {
  message: string
  onRemoveMessage: () => void
}

const RemoveMessageDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { message } = props

  const onRemove = () => {
    // onRemoveMessage({id: id})
    setOpen(false)
  }

  return (
    <div>
      <Tooltip title={`Delete`}>
        <IconButton onClick={() => setOpen(true)} color="inherit">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
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

type DispatchProps = Pick<Props, 'onRemoveMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRemoveMessage: () => {},
})

export default connect(null, mapDispatchToProps)(RemoveMessageDialog)