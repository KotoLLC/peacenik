import React, { FormEvent, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import { validate } from '@services/validation'
import { RouteComponentProps } from 'react-router-dom'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloseIcon from '@material-ui/icons/Close'
import queryString from 'query-string'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import successIcon from '@assets/images/success-icon.svg'
import {
  AuthForm,
  FormSubtitle,
  SubmitButton,
  TextFieldStyled,
  CloseButton,
  SuccessIconWrapper,
  SuccessIcon,
  ConfirmMessage,
} from '../components/styles'

type FieldsType = 'password' | ''

export interface Props extends RouteComponentProps {
  passwordErrorMessage: string
  isResetPasswordSuccess: boolean

  onResetPasswordRequest: (data: ApiTypes.ResetPassword) => void
  onCleanPasswordFailedMessage: () => void
}

const ResetPasswordPage = (props) => {
  const [password, onPasswordChange] = useState<string>('')
  const [isPasswordVisible, onPasswordOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)
  const { passwordErrorMessage, onResetPasswordRequest, isResetPasswordSuccess, history } = props

  const onValidate = (): boolean => {
    if (!validate.isPasswordValid(password)) {
      setErrorMessage('Password is incorrect')
      setNoValideField('password')
      return false
    }

    return true
  }

  const url = props.location.search
  const params = queryString.parse(url)
  const { name, token } = params

  const onFormSubmit = (event: FormEvent) => {
    props.onCleanPasswordFailedMessage()
    event.preventDefault()
    if (!onValidate()) return

    setRequest(true)
    setErrorMessage('')
    setNoValideField('')

    onResetPasswordRequest({
      reset_token: token,
      new_password: password,
      name
    })
  }

  useEffect(() => {
    if (passwordErrorMessage !== '') {
      setErrorMessage(passwordErrorMessage)
      setRequest(false)
    }

    setRequest(false)

  }, [passwordErrorMessage, onResetPasswordRequest, isResetPasswordSuccess, history])

  const renderForm = () => (
    <>
      <FormSubtitle>Enter your new password</FormSubtitle>
      <TextFieldStyled
        variant="outlined"
        placeholder="Password"
        id="password"
        type={isPasswordVisible ? 'text' : 'password'}
        value={password}
        onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
        error={(noValideField === 'password') ? true : false}
        InputProps={{
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => onPasswordOpen(!isPasswordVisible)}
              onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
              edge="end"
            >
              {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          )
        }}
      />
      <SubmitButton
        type="submit"
        onClick={onFormSubmit}
        className="green"
      >{isRequest ? <CircularProgress size={20} color={'inherit'} /> : 'Send'}</SubmitButton>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  )

  const renderSuccessMessage = () => (
    <>
      <SuccessIconWrapper>
        <SuccessIcon src={successIcon}/>
      </SuccessIconWrapper>
      <ConfirmMessage>New password sent successfully. Please check your email</ConfirmMessage>
    </>
  )

  return (
    <>
      <AuthForm onSubmit={onFormSubmit}>
        <CloseButton onClick={() => history.push('/login')}>
          <CloseIcon />
        </CloseButton>
        {isResetPasswordSuccess ? renderSuccessMessage() : renderForm()}
      </AuthForm>
    </>
  )
}

type StateProps = Pick<Props, 'passwordErrorMessage' | 'isResetPasswordSuccess'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  passwordErrorMessage: selectors.authorization.passwordErrorMessage(state),
  isResetPasswordSuccess: selectors.authorization.isResetPasswordSuccess(state),
})

type DispatchProps = Pick<Props, 'onResetPasswordRequest' | 'onCleanPasswordFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onResetPasswordRequest: (data: ApiTypes.ResetPassword) => dispatch(Actions.authorization.resetPasswordRequest(data)),
  onCleanPasswordFailedMessage: () => dispatch(Actions.authorization.cleanPasswordFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage)