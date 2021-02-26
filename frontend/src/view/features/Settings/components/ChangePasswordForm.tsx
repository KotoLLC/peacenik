import React, { ChangeEvent, FormEvent } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
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

type FieldsType = 'newPassword' | 'currentPassword' | ''

interface State {
  isRequestSend: boolean
  errorMessage: string
  currentPassword: string
  newPassword: string
  noValideField: FieldsType
  isCurrentPasswordVisible: boolean
  isNewPasswordVisible: boolean
}

class ChangePasswordForm extends React.PureComponent<Props, State> {

  state = {
    isRequestSend: false,
    errorMessage: '',
    currentPassword: '',
    newPassword: '',
    noValideField: '' as FieldsType,
    isCurrentPasswordVisible: false,
    isNewPasswordVisible: false,
  }

  onCurrentPaaswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      currentPassword: event.currentTarget.value.trim(),
    })
  }

  onNewPaaswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newPassword: event.currentTarget.value.trim(),
    })
  }

  onValidate = (): boolean => {
    const { currentPassword, newPassword } = this.state

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

  render() {
    const {
      errorMessage,
      noValideField,
      currentPassword,
      newPassword,
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isRequestSend,
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
              onChange={this.onCurrentPaaswordChange}
              error={(noValideField === 'currentPassword') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                    onMouseDown={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                    edge="end"
                  >
                    {isCurrentPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
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
              onChange={this.onNewPaaswordChange}
              error={(noValideField === 'newPassword') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                    onMouseDown={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                    edge="end"
                  >
                    {isNewPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </SettingsFieldWrapper>
          {/* <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Confirm password</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant="outlined"
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              // value={password}
              // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
              // error={(noValideField === 'password') ? true : false}
              InputProps={{
                startAdornment: (
                  <LockIcon />
                ),
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => onPasswordOpen(!isPasswordVisible)}
                    onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
                    edge="end"
                  >
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </SettingsFieldWrapper> */}
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