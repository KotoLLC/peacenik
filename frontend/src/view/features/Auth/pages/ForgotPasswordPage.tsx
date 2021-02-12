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
import {
  AuthForm,
  FormSubtitle,
  SubmitButton,
  TextFieldStyled,
  CloseButton,
} from './../components/styles'

type FieldsType = 'username' | 'email' | ''

export interface Props extends RouteComponentProps {
  passwordErrorMessage: string
  isForgotPasswordSent: boolean
  onResetPasswordRequest: (data: ApiTypes.ForgotPassword) => void
  onCleanPasswordFailedMessage: () => void
}

const ForgotPasswordPage = (props) => {
  const [username, onUsernameChange] = useState<string>('')
  const [email, onEmailChange] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)

  const { passwordErrorMessage, onResetPasswordRequest, isForgotPasswordSent, history } = props

  const onValidate = (): boolean => {
    if (!validate.isUserNameValid(username)) {
      setErrorMessage('User Name is incorrect')
      setNoValideField('username')
      return false
    }

    if (!validate.isEmailValid(email)) {
      setErrorMessage('Email is incorrect')
      setNoValideField('email')
      return false
    }

    return true
  }

  const onFormSubmit = (event: FormEvent) => {
    props.onCleanPasswordFailedMessage()
    event.preventDefault()
    if (!onValidate()) return

    setRequest(true)
    setErrorMessage('')
    setNoValideField('')

    onResetPasswordRequest({
      name: username,
      email,
    })
  }

  useEffect(() => {
    if (passwordErrorMessage !== '') {
      setErrorMessage(passwordErrorMessage)
      setRequest(false)
    }

    if (isForgotPasswordSent === true) {
      setErrorMessage('')
      setRequest(false)
    }

  }, [passwordErrorMessage, onResetPasswordRequest, isForgotPasswordSent])

  return (
    <>
      <AuthForm onSubmit={onFormSubmit}>
        <CloseButton onClick={() => history.push('/login')}>
          <CloseIcon />
        </CloseButton>
        <FormSubtitle>To send a request to change password, fit out the following fields</FormSubtitle>
        <TextFieldStyled
          id="username"
          variant="outlined"
          placeholder="Username"
          type="text"
          value={username}
          error={(noValideField === 'username') ? true : false}
          onChange={(event) => onUsernameChange(event.currentTarget.value.trim())}
        />
        <TextFieldStyled
          id="email"
          variant="outlined"
          placeholder="Email"
          type="text"
          value={email}
          error={(noValideField === 'email') ? true : false}
          onChange={(event) => onEmailChange(event.currentTarget.value.trim())}
        />
        <SubmitButton
          type="submit"
          onClick={onFormSubmit}
          className="green"
        >{isRequest ? <CircularProgress size={20} color={'inherit'} /> : 'Send'}</SubmitButton>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </AuthForm>
    </>
  )
}

type StateProps = Pick<Props, 'passwordErrorMessage' | 'isForgotPasswordSent'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  passwordErrorMessage: selectors.authorization.passwordErrorMessage(state),
  isForgotPasswordSent: selectors.authorization.isForgotPasswordSent(state),
})

type DispatchProps = Pick<Props, 'onResetPasswordRequest' | 'onCleanPasswordFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onResetPasswordRequest: (data: ApiTypes.ForgotPassword) => dispatch(Actions.authorization.forgotPasswordRequest(data)),
  onCleanPasswordFailedMessage: () => dispatch(Actions.authorization.cleanPasswordFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage)