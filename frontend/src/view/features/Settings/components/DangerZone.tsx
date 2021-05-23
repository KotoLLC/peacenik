import React from 'react'
import { Redirect } from "react-router-dom"
import {
  DangerZoneWrapper,
  DeleteAccountNote
} from './styles'
import { ButtonOutlined } from '@view/shared/styles'
import { useDispatch, useSelector } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes } from 'src/types'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'

export const DangerZone = () => {
  const dispatch = useDispatch()
  const btnDisable = useSelector( (state: StoreTypes) => state.profile.deleteAccountRequest )
  const deleteAccountSuccess = useSelector( (state: StoreTypes) => state.profile.deleteAccountSuccess)
  const [isOpen, setOpen] = React.useState(false)

  const deleteAccount = () => {
    dispatch(Actions.profile.deleteAccountRequest())
  }

  const onLogoutClick = () => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(Actions.authorization.logoutRequest())
  }

  if ( deleteAccountSuccess ){
    dispatch(Actions.profile.setDeleteAccountSuccess())
    onLogoutClick()
    return <Redirect to='/login' />
  } else {
    return (
      <>
      <DangerZoneWrapper>
        <DeleteAccountNote>warning. Deleting your account will delete all your messages, attachments, friendships, etc.This action cannot be undone. It is permanent. Be careful.</DeleteAccountNote>
        <ButtonOutlined className="grey" onClick={() => setOpen(true)} disabled={btnDisable} >delete my account</ButtonOutlined>
      </DangerZoneWrapper>
      <ModalDialog
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}>
        <ModalSubTitle>You really want to delete your account?</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton onClick={() => setOpen(false)}>Cancel</ModalCancelButton>
          <ModalAllowButton onClick={deleteAccount}>Remove</ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
      </>
    ) 
  }
}