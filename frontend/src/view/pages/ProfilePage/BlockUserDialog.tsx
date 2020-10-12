import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import {
  DialogTextWrapper,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'

interface Props {
  userId: string
  onDisableUser: (value: string) => void
}

const BlockUserDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { onDisableUser, userId } = props

  const onBlock = () => {
    onDisableUser(userId)
    setOpen(false)
  }

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Block</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">WARNING!</DialogTitleStyled>
        <DialogContentStyled>
          <DialogTextWrapper>
            Blocking a user is permanent. There is no way to un-block them. This means you will not be able to see 
            them in any friend lists, read their comments, invite them to be friends, or receive invitations from 
            them. Your profile will also be hidden from them.
          </DialogTextWrapper>
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onBlock} autoFocus>
            Block
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

type DispatchProps = Pick<Props, 'onDisableUser'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDisableUser: (value: string) => dispatch(Actions.profile.disableUserRequest(value)),
})

export default connect(null, mapDispatchToProps)(BlockUserDialog)