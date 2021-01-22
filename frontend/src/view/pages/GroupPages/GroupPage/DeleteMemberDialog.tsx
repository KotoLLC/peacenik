import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { DialogTitleStyled } from '@view/shared/styles'
import {
  DialogContentStyled,
  MemberButtonOutlined,
} from './styles'

interface Props extends RouteComponentProps {
  groupId: string
  memberId: string
  errorMessage: string
  isMemberDeletedSuccessfully: boolean

  onDeleteMemberSuccess: (value: boolean) => void
  onDeleteMember: (data: ApiTypes.Groups.DeleteMember) => void
}

const DeleteMemberDialog: React.FC<Props> = (props) => {
  const {
    isMemberDeletedSuccessfully,
    errorMessage,
    onDeleteMember,
    onDeleteMemberSuccess,
    groupId,
    memberId,
  } = props
  const [isReqeted, setRequested] = useState(false)
  const [open, setOpen] = useState(false)

  const onDelete = () => {
    setRequested(true)
    onDeleteMember({
      group_id: groupId,
      user_id: memberId,
    })
    setOpen(false)
  }

  useEffect(() => {
    if (isMemberDeletedSuccessfully) {
      setRequested(false)
      onDeleteMemberSuccess(false)
      setOpen(false)
    }
    if (errorMessage) {
      setRequested(false)
    }
  }, [isMemberDeletedSuccessfully])

  return (
    <>
      <MemberButtonOutlined onClick={() => setOpen(true)} className="gray">Remove</MemberButtonOutlined>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">Remove</DialogTitleStyled>
        <DialogContentStyled>
          Are you sure? <br />This action can`t be undone.
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="secondary"
            disabled={isReqeted}
            onClick={onDelete}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

type StateProps = Pick<Props, 'errorMessage' | 'isMemberDeletedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: state.common.errorMessage,
  isMemberDeletedSuccessfully: selectors.groups.isMemberDeletedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onDeleteMember' | 'onDeleteMemberSuccess'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteMember: (data: ApiTypes.Groups.DeleteMember) => dispatch(Actions.groups.deleteMemberRequest(data)),
  onDeleteMemberSuccess: (value: boolean) => dispatch(Actions.groups.deleteMemberSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DeleteMemberDialog))