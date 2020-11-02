import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { ApiTypes } from 'src/types'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import Button from '@material-ui/core/Button'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import ListItemText from '@material-ui/core/ListItemText'
import { DialogTitleStyled, ListItemIconStyled, MenuItemWrapper } from '@view/shared/styles'

interface Props {
  userId: string
  userName: string

  onRejectInvitation: (value: ApiTypes.Friends.InvitationReject) => void
}

const UnfriendDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { onRejectInvitation, userId, userName = '' } = props

  const onRemove = () => {
    onRejectInvitation({ inviter_id: userId })
    setOpen(false)
  }

  return (
    <>
      <MenuItemWrapper onClick={() => setOpen(true)}>
        <ListItemIconStyled>
          <PersonAddDisabledIcon fontSize="small" />
        </ListItemIconStyled>
        <ListItemText primary="Unfriend" />
      </MenuItemWrapper>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">Are you sure you'd like to remove {capitalizeFirstLetter(userName)} from your friend's list?</DialogTitleStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

type DispatchProps = Pick<Props, 'onRejectInvitation'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRejectInvitation: (data: ApiTypes.Friends.InvitationReject) => dispatch(Actions.friends.rejectInvitationRequest(data)),
})

export default connect(null, mapDispatchToProps)(UnfriendDialog)