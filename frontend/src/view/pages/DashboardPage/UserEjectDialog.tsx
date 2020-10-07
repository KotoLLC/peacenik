import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import Avatar from '@material-ui/core/Avatar'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  DialogTextWrapper,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'
import { 
  AvatarWrapper, 
  UserNameWrapper,
  UserName,
  UserInfo,
} from '@view/pages/MessagesPage/styles'
import { ButtonStyled } from './styles'

interface Props {
  reportId: string
  userId: string
  userName: string
  sourceHost: string

  onUserEject: (data: ApiTypes.Dashboard.EjectUser) => void
}

const UserEjectDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { onUserEject, reportId, sourceHost, userId, userName } = props

  const onRemove = () => {
    onUserEject({
      host: sourceHost,
      user_id: userId,
      report_id: reportId,
    })
    setOpen(false)
  }

  return (
    <div>
      <ButtonStyled
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
      >Eject</ButtonStyled>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">You really want to eject this user?</DialogTitleStyled>
        <DialogContentStyled>
          <DialogTextWrapper>
            <UserInfo>
              <AvatarWrapper>
                <Avatar src={getAvatarUrl(userId)} />
              </AvatarWrapper>
              <UserNameWrapper>
                <UserName>{userName}</UserName>
              </UserNameWrapper>
            </UserInfo>
          </DialogTextWrapper>
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onRemove} autoFocus>
            eject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

type DispatchProps = Pick<Props, 'onUserEject'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onUserEject: (data: ApiTypes.Dashboard.EjectUser) => dispatch(Actions.dashboard.blockReportedUserRequest(data)),
})

export default connect(null, mapDispatchToProps)(UserEjectDialog)