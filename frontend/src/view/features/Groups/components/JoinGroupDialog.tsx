import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
  TextFieldWrapper,
  TextFieldLabel,
  TextareaStyled,
} from '@view/shared/ModalDialog/styles'
import { ButtonContained } from '@view/shared/styles'

interface Props {
  groupId: string
  errorMessage: string
  joinToGroupRequestSuccessfully: boolean
  buttonText: string
  buttonClassName?: string

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
    buttonText,
    buttonClassName,
  } = props

  const [isReqeted, setRequested] = useState<boolean>(false)
  const [isOpen, setOpen] = useState<boolean>(false)
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
      <ButtonContained 
        onClick={() => setOpen(true)} 
        className={buttonClassName}>
        {buttonText}
      </ButtonContained>
      <ModalDialog
        title="Join group"
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}>
        <TextFieldWrapper>
          <TextFieldLabel>Tell us about yourself</TextFieldLabel>
          <TextareaStyled
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        </TextFieldWrapper>
        <ModalButtonsGroup>
          <ModalCancelButton
            className="grey"
            onClick={() => setOpen(false)}>
            Cancel
          </ModalCancelButton>
          <ModalAllowButton
            disabled={isReqeted}
            onClick={onJoin}>
            Send
            </ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type StateProps = Pick<Props, 'errorMessage' | 'joinToGroupRequestSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: selectors.common.errorMessage(state),
  joinToGroupRequestSuccessfully: selectors.groups.joinToGroupRequestSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onJoinToGroupRequest' | 'onJoinToGroupSuccess'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onJoinToGroupRequest: (data: ApiTypes.Groups.RequestJoin) => dispatch(Actions.groups.joinToGroupRequest(data)),
  onJoinToGroupSuccess: (value: boolean) => dispatch(Actions.groups.joinToGroupSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroupDialog)