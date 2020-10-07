import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import {
  DialogTextWrapper,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'
import { CroppedText } from '../MessagesPage/styles'
import { ButtonStyled } from './styles'

interface Props {
  message: string
  id: string
  sourceHost: string
  onDeleteContent: (data: ApiTypes.Dashboard.DeleteReportedMessage) => void
}

const DeleteComplainContentDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { message, onDeleteContent, id, sourceHost } = props

  const onRemove = () => {
    onDeleteContent({
      host: sourceHost,
      body: {
        report_id: id
      }
    })
    setOpen(false)
  }

  return (
    <div>
      <ButtonStyled
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
      >Delete</ButtonStyled>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">You really want to delete this content?</DialogTitleStyled>
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

type DispatchProps = Pick<Props, 'onDeleteContent'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteContent: (data: ApiTypes.Dashboard.DeleteReportedMessage) => dispatch(Actions.dashboard.deleteReportedMessageRequest(data)),
})

export default connect(null, mapDispatchToProps)(DeleteComplainContentDialog)