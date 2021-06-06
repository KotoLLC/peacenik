import React, { ChangeEvent, FormEvent } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import LockIcon from '@material-ui/icons/Lock'
import { validate } from '@services/validation'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import Actions from '@store/actions'

import {
  ErrorMessage,
  EditButtonsWrapper,
} from '@view/shared/styles'
import {
  SettingsFormWrapper,
  SettingsFieldWrapper,
  SettingsFieldPlaceholder,
  TextFieldStyled,
  ButtonContainedStyled,
  FormTitle,
} from './styles'

interface Props {
  profileErrorMessage: string

  onEditProfile: (data: ApiTypes.Profile.EditProfile) => void
  onGetProfile: () => void
}

type FieldsType = 'newPassword' | 'currentPassword' | 'confirmPassword' | ''

interface State {
  isRequestSend: boolean
  errorMessage: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  noValideField: FieldsType
  isCurrentPasswordVisible: boolean
  isNewPasswordVisible: boolean
  isConfirmPasswordVisible: boolean
}

class ChangePasswordForm extends React.PureComponent<Props, State> {

  state = {
    isRequestSend: false,
    errorMessage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    noValideField: '' as FieldsType,
    isCurrentPasswordVisible: false,
    isNewPasswordVisible: false,
    isConfirmPasswordVisible: false,
  }

  onCurrentPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      currentPassword: event.currentTarget.value.trim(),
    })
  }

  onNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newPassword: event.currentTarget.value.trim(),
    })
  }

  onConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmPassword: event.currentTarget.value.trim(),
    })
  }

  onValidate = (): boolean => {
    const { currentPassword, newPassword, confirmPassword } = this.state

    if (currentPassword || newPassword) {
      if (newPassword && !currentPassword) {
        this.setState({
          errorMessage: 'Enter Your current password',
          noValideField: 'currentPassword',
        })
        return false
      }

      if (!validate.isPasswordValid(newPassword)) {
        this.setState({
          errorMessage: 'New password is incorrect',
          noValideField: 'newPassword',
        })
        return false
      }

      if (newPassword !== confirmPassword) {
        this.setState({
          errorMessage: 'Confirm password isn`t equel to new password',
          noValideField: 'confirmPassword',
        })
        return false
      }
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()

    const { currentPassword, newPassword } = this.state
    const { onEditProfile } = this.props

    if (!this.onValidate()) return

    let passwordData = {}

    if (newPassword) {
      passwordData = {
        password_changed: true,
        current_password: currentPassword,
        new_password: newPassword,
      }
    }

    const data = { ...passwordData }
    onEditProfile(data)

    this.setState({
      isRequestSend: true,
      errorMessage: '',
      noValideField: '',
    })
  }

  onCurrentPasswordOpen = (value: boolean) => {
    this.setState({
      isCurrentPasswordVisible: value
    })
  }

  onNewPasswordOpen = (value: boolean) => {
    this.setState({
      isNewPasswordVisible: value
    })
  }

  onConfirmPasswordOpen = (value: boolean) => {
    this.setState({
      isConfirmPasswordVisible: value
    })
  }

  render() {
    const {
      errorMessage,
      noValideField,
      currentPassword,
      newPassword,
      confirmPassword,
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isRequestSend,
      isConfirmPasswordVisible,
    } = this.state

    return (
      <>
        <SettingsFormWrapper>
          <FormTitle>Change password</FormTitle>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Current password</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant="outlined"
              id="currentPassword"
              type={isCurrentPasswordVisible ? 'text' : 'password'}
              value={currentPassword}
              onChange={this.onCurrentPasswordChange}
              error={(noValideField === 'currentPassword') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <span
                    onClick={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                    onMouseDown={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                  >
                    {isCurrentPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </span>
                ),
              }}
            />
          </SettingsFieldWrapper>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>New password</SettingsFieldPlaceholder>
            <TextFieldStyled
              id="newPassword"
              variant="outlined"
              type={isNewPasswordVisible ? 'text' : 'password'}
              value={newPassword}
              onChange={this.onNewPasswordChange}
              error={(noValideField === 'newPassword') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <span
                    onClick={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                    onMouseDown={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                  >
                    {isNewPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </span>
                ),
              }}
            />
          </SettingsFieldWrapper>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Confirm password</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant="outlined"
              id="confirmPassword"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={this.onConfirmPasswordChange}
              error={(noValideField === 'confirmPassword') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <span
                    onClick={() => this.onConfirmPasswordOpen(!isConfirmPasswordVisible)}
                    onMouseDown={() => this.onConfirmPasswordOpen(!isConfirmPasswordVisible)}
                  >
                    {isConfirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </span>
                ),
              }}
            />
          </SettingsFieldWrapper>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <EditButtonsWrapper>
            <ButtonContainedStyled disabled={isRequestSend} onClick={this.onFormSubmit}>
              {isRequestSend ? <CircularProgress size={20} color={'inherit'} /> : 'Change password'}
            </ButtonContainedStyled>
          </EditButtonsWrapper>
        </SettingsFormWrapper>
      </>
    )
  }
}

type StateProps = Pick<Props, 'profileErrorMessage'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  profileErrorMessage: selectors.profile.profileErrorMessage(state),
})

type DispatchProps = Pick<Props, 'onEditProfile' | 'onGetProfile'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => dispatch(Actions.profile.editProfileRequest(data)),
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm)