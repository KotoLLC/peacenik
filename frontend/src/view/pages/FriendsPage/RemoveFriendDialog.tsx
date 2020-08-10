import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import { ApiTypes } from 'src/types'
import CancelIcon from '@material-ui/icons/Cancel'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import { DialogTitleStyled } from '@view/shared/styles'

interface Props extends ApiTypes.Friends.Friend {
  onRejectInvitation: (value: ApiTypes.Friends.InvitationReject) => void
}

const RemoveFriendDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { onRejectInvitation, user } = props

  const onRemove = () => {
    onRejectInvitation({ inviter_id: user.id })
    setOpen(false)
  }

  return (
    <div>
      <IconButton onClick={() => setOpen(true)} >
        <CancelIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">Are you sure you'd like to remove {capitalizeFirstLetter(user.name)} from your friend's list?</DialogTitleStyled>
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

type DispatchProps = Pick<Props, 'onRejectInvitation'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRejectInvitation: (data: ApiTypes.Friends.InvitationReject) => dispatch(Actions.friends.rejectInvitationRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveFriendDialog)