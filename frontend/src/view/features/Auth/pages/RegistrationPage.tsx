import React, { FormEvent, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import { validate } from '@services/validation'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import { Link, RouteComponentProps } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import queryString from 'query-string'
import { CheckboxLabel } from '@view/shared/styles'
import {
  AuthForm,
  FormSubtitle,
  SubmitButton,
  TextFieldStyled,
  TextFieldNote,
  Separator,
  LinkBlock,
  CheckboxFieldWrapper,
  LabelLink,
} from '../components/styles'

type FieldsType = 'username' | 'password' | 'email' | ''

export interface Props extends RouteComponentProps {
  registrationErrorMessage: string
  isRegisterSuccess: boolean
  isUserRegisteredResult: boolean | null
  isLogged: boolean

  onRegisterUser: (data: ApiTypes.RegisterUser) => void
  onResetRegistrationResult: () => void
  onLogin: (data: ApiTypes.Login) => void
}

const RegistrationPage = (props) => {
  const url = props.location.search
  const params = queryString.parse(url)

  const [username, onNameChange] = useState<string>('')
  const [userFullName, onFullNameChange] = useState<string>('')
  const [email, onEmailChange] = useState<string>(params?.email as string || '')
  const [password, onPasswordChange] = useState<string>('')
  const [isLicenseChecked, onLicenseCheck] = useState<boolean>(false)
  const [isPasswordVisible, onPasswordOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)
  const {
    onRegisterUser,
    location,
    history,
    registrationErrorMessage,
    isRegisterSuccess,
    onResetRegistrationResult,
    isUserRegisteredResult,
    onLogin,
    isLogged,
  } = props

  const onValidate = (): boolean => {

    if (!validate.isUserNameValid(username)) {
      setErrorMessage('Your username contains invalid characters, allowed: a-z A-Z 0-9 @ . -')
      setNoValideField('username')
      return false
    }

    if (!validate.isEmailValid(email)) {
      setErrorMessage('Email is incorrect')
      setNoValideField('email')
      return false
    }

    if (!validate.isPasswordValid(password)) {
      setErrorMessage('Password is incorrect')
      setNoValideField('password')
      return false
    }

    return true
  }

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    onResetRegistrationResult()

    if (!onValidate()) return
    setRequest(true)
    setErrorMessage('')
    setNoValideField('')

    onRegisterUser({
      name: username,
      password,
      email,
      full_name: userFullName,
      invite_token: params?.invite as string,
    })
  }

  useEffect(() => {

    if (registrationErrorMessage !== '') {
      setErrorMessage(registrationErrorMessage)
      setRequest(false)
    }

    if (isRegisterSuccess === true) {

      if (params?.invite) {
        onLogin({ name: username, password })
      }

      if (isLogged) {
        history.push('/friends/invitations')
      } else {
        history.push('/resend-confirm-email')
      }

      setRequest(false)
    }
  }, [location, history, registrationErrorMessage, isRegisterSuccess, isUserRegisteredResult, isLogged, onLogin, params, password, username])

  return (
    <>
      <AuthForm onSubmit={onFormSubmit}>
        <FormSubtitle>Peacenik is an ad-free, friendly, distributed social network</FormSubtitle>
        <TextFieldStyled
          id="username"
          variant="outlined"
          placeholder="Username (jsmith)"
          type="text"
          value={username}
          error={(noValideField === 'username') ? true : false}
          onChange={(event) => onNameChange(event.currentTarget.value.trim())}
        />
        <TextFieldNote>Providing your real name lets friends identify you more easily</TextFieldNote>
        <TextFieldStyled
          id="fullname"
          variant="outlined"
          placeholder="Full name (John Smith)"
          type="text"
          value={userFullName}
          onChange={(event) => onFullNameChange(event.currentTarget.value)}
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
        <CheckboxFieldWrapper>
          <CheckboxLabel
            control={
              <Checkbox
                checked={isLicenseChecked}
                onChange={(event) => onLicenseCheck(event.target.checked)}
                name="rememberMe"
                color="primary"
              />
            }
            label=""
          />
          <LabelLink to={'/docs/code-of-conduct'}>I agree to peacenik's End User License Agreement (EULA)</LabelLink>
        </CheckboxFieldWrapper>
        <SubmitButton
          type="submit"
          onClick={onFormSubmit}
          disabled={isLicenseChecked ? false : true}
          className="green"
        >{isRequest ? <CircularProgress size={20} color={'inherit'} /> : 'Register'}</SubmitButton>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </AuthForm>
      <Separator>OR</Separator>
      <LinkBlock>
        Already have an account?  <Link to="/login">Login!</Link>
      </LinkBlock>
    </>
  )
}

type StateProps = Pick<Props, 'registrationErrorMessage' | 'isRegisterSuccess' | 'isUserRegisteredResult' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  registrationErrorMessage: selectors.registration.registrationErrorMessage(state),
  isRegisterSuccess: selectors.registration.isRegisterSuccess(state),
  isUserRegisteredResult: selectors.registration.isUserRegisteredResult(state),
  isLogged: selectors.authorization.isLogged(state),
})

type DispatchProps = Pick<Props, 'onRegisterUser' | 'onResetRegistrationResult' | 'onLogin'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRegisterUser: (data: ApiTypes.RegisterUser) => dispatch(Actions.registration.registerUserRequest(data)),
  onResetRegistrationResult: () => { dispatch(Actions.registration.resetRegistrationResult()) },
  onLogin: (data: ApiTypes.Login) => dispatch(Actions.authorization.loginRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage)
