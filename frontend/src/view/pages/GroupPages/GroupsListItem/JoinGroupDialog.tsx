import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import { TextareaStyled } from './styles'
import { DialogContentStyled } from '../GroupPage/styles'
import { 
  DialogTitleStyled, 
  ButtonContained,
} from '@view/shared/styles'

 interface Props {
   groupId: string
   errorMessage: string
   joinToGroupRequestSuccessfully: boolean
   
   onJoinToGroupRequest: (data: ApiTypes.Groups.RequestJoin) => void
   onJoinToGroupSuccess: (value: boolean) => void
 }

const JoinGroupDialog: React.FC<Props> = (props) => {
  const { 
    groupId, 
    errorMessage,
    onJoinToGroupRequest,
    onJoinToGroupSuccess,
    joinToGroupRequestSuccessfully,
  } = props
  
  const [ isReqeted, setRequested ] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const onJoin = () => {
    setRequested(true)
    onJoinToGroupRequest({
      group_id: groupId,
      message,
    })
  }

  useEffect(() => {
    if (joinToGroupRequestSuccessfully) {
      setRequested(false)
      onJoinToGroupSuccess(false)
      setOpen(false)
    }
    if (errorMessage) {
      setRequested(false)
    }
  }, [joinToGroupRequestSuccessfully])

  return (
      <>
      <ButtonContained onClick={() => setOpen(true)} className="extra-small">Join</ButtonContained>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">Join group</DialogTitleStyled>
        <DialogContentStyled>
          Tell us about yourself
          <TextareaStyled value={message} onChange={(event) => setMessage(event.target.value)} />
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isReqeted} color="secondary" onClick={onJoin} autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

type StateProps = Pick<Props, 'errorMessage' | 'joinToGroupRequestSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: state.common.errorMessage,
  joinToGroupRequestSuccessfully: selectors.groups.joinToGroupRequestSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onJoinToGroupRequest' | 'onJoinToGroupSuccess'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onJoinToGroupRequest: (data: ApiTypes.Groups.RequestJoin) => dispatch(Actions.groups.joinToGroupRequest(data)),
  onJoinToGroupSuccess: (value: boolean) => dispatch(Actions.groups.joinToGroupSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroupDialog)