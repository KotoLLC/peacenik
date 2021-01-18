import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { 
  DialogTitleStyled, 
  ButtonContained,
} from '@view/shared/styles'
import { 
  DangerZoneWrapper, 
  DangerZoneTitle,
  DialogContentStyled,
 } from './styles'

 interface Props extends RouteComponentProps {
   groupId: string
   errorMessage: string
   isGroupDeletedSuccessfully: boolean
   
   onDeleteGroup: (value: string) => void
   onDeleteGroupSuccess: (value: boolean) => void
 }

const DeleteGroupDialog: React.FC<Props> = (props) => {
  const { 
    groupId, 
    isGroupDeletedSuccessfully,
    errorMessage,
    onDeleteGroupSuccess,
    onDeleteGroup, 
    history,
  } = props
  const [ isReqeted, setRequested ] = useState(false)
  const [open, setOpen] = useState(false)

  const onDestroy = () => {
    setRequested(true)
    onDeleteGroup(groupId)
    setOpen(false)
  }

  useEffect(() => {
    if (isGroupDeletedSuccessfully) {
      setRequested(false)
      onDeleteGroupSuccess(false)
      setOpen(false)
      history.push('/groups')
    }
    if (errorMessage) {
      setRequested(false)
    }
  }, [isGroupDeletedSuccessfully])

  return (
    <DangerZoneWrapper>
      <DangerZoneTitle>Danger Zone</DangerZoneTitle>
      <ButtonContained onClick={() => setOpen(true)} className="small gray">Destroy</ButtonContained>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">Destroy</DialogTitleStyled>
        <DialogContentStyled>
          Are you sure? <br/>This action can`t be undone.
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isReqeted} color="secondary" onClick={onDestroy} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </DangerZoneWrapper>
  )
}

type StateProps = Pick<Props, 'errorMessage' | 'isGroupDeletedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: state.common.errorMessage,
  isGroupDeletedSuccessfully: selectors.groups.isGroupDeletedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onDeleteGroup' | 'onDeleteGroupSuccess'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteGroup: (value: string) => dispatch(Actions.groups.deleteGroupRequest(value)),
  onDeleteGroupSuccess: (value: boolean) => dispatch(Actions.groups.deleteGroupSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DeleteGroupDialog))