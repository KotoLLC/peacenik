import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { MemberButtonOutlined } from './styles'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'

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
  const [isOpen, setOpen] = useState(false)

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
  }, [isMemberDeletedSuccessfully, errorMessage, onDeleteMemberSuccess])

  return (
    <>
      <MemberButtonOutlined onClick={() => setOpen(true)} className="grey">Remove</MemberButtonOutlined>
      <ModalDialog
        title="Remove"
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}>
        <ModalSubTitle>Are you sure? <br />This action can`t be undone.</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton
            className="grey"
            onClick={() => setOpen(false)}>
            Cancel
          </ModalCancelButton>
          <ModalAllowButton
            disabled={isReqeted}
            onClick={onDelete}>
            Yes
            </ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type StateProps = Pick<Props, 'errorMessage' | 'isMemberDeletedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: selectors.common.errorMessage(state),
  isMemberDeletedSuccessfully: selectors.groups.isMemberDeletedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onDeleteMember' | 'onDeleteMemberSuccess'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onDeleteMember: (data: ApiTypes.Groups.DeleteMember) => dispatch(Actions.groups.deleteMemberRequest(data)),
  onDeleteMemberSuccess: (value: boolean) => dispatch(Actions.groups.deleteMemberSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DeleteMemberDialog))