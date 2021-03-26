import React, { FormEvent, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import { validate } from '@services/validation'
import { useLastLocation } from 'react-router-last-location'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import { Link, RouteComponentProps } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import { CheckboxLabel } from '@view/shared/styles'
import {
  AuthForm,
  FormSubtitle,
  SubmitButton,
  TextFieldStyled,
  Separator,
  LinkBlock,
  CheckBoxNote,
  CheckboxFieldWrapper,
  FormLink,
} from './../components/styles'

type FieldsType = 'username' | 'password' | ''

export interface Props extends RouteComponentProps {
  loginErrorMessage: string
  isLogged: boolean

  onLogin: (data: ApiTypes.Login) => void
  resetLoginFailedMessage: () => void
}

const LoginPage = (props) => {
  const [username, onEmailChange] = useState<string>('')
  const [password, onPasswordChange] = useState<string>('')
  const [isRememberedMe] = useState<boolean>(false)
  const [isPasswordVisible, onPasswordOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)
  const { loginErrorMessage, isLogged, onLogin, location, history } = props
  const [isLicenseChecked, onLicenseCheck] = useState<boolean>(false)

  const onValidate = (): boolean => {
    if (!validate.isUserNameValid(username)) {
      setErrorMessage('Your username contains invalid characters, allowed: a-z A-Z 0-9 @ . -')
      setNoValideField('username')
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
    props.resetLoginFailedMessage()
    event.preventDefault()
    if (!onValidate()) return

    setRequest(true)
    setErrorMessage('')
    setNoValideField('')

    onLogin({
      name: username,
      password,
      remember_me: isRememberedMe,
    })
  }

  const checkExcludedRoutes = (path?: string) => {
    const excludedRoutes = ['reset-password', 'forgot-password', 'docs', 'no-hubs', 'registration']
    if (!path) return false
    return excludedRoutes.some(item => path.indexOf(item) !== -1)
  }

  const lastLocation = useLastLocation()
  const lastLoactionPathname = lastLocation?.pathname

  useEffect(() => {
    if (loginErrorMessage !== '') {
      setErrorMessage(loginErrorMessage)
      setRequest(false)
    }

    if (isLogged === true) {
      if (location.pathname !== lastLoactionPathname) {
        if (lastLoactionPathname === '/registration' || lastLoactionPathname === '/resend-confirm-email') {
          history.push('/friends/invitations')
        }
        if (checkExcludedRoutes(lastLoactionPathname)) {
          history.push('/feed')
        } else {
          history.push(lastLoactionPathname ? `${lastLoactionPathname}` : '/feed')
        }
      }
      setRequest(false)
    }
  }, [loginErrorMessage, isLogged, onLogin, location, history, lastLoactionPathname])

  return (
    <>
      <AuthForm onSubmit={onFormSubmit}>
        <FormSubtitle>Peacenik is an ad-free, friendly, distributed social network</FormSubtitle>
        <TextFieldStyled
          id="username"
          variant="outlined"
          placeholder="Username"
          type="text"
          value={username}
          error={(noValideField === 'username') ? true : false}
          onChange={(event) => onEmailChange(event.currentTarget.value.trim())}
        />
        <FormLink to="/forgot-username">Forgot username?</FormLink>
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
        <FormLink to="/forgot-password">Forgot password?</FormLink>
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
          <CheckBoxNote>
            I agree to Peacenik's <a href='https://about.peacenik.app/end-user-license-agreement'>End User License Agreement</a> and <a href='https://about.peacenik.app/code-of-conduct'>Code of Conduct</a></CheckBoxNote> 
        </CheckboxFieldWrapper>
        <SubmitButton
          type="submit"
          onClick={onFormSubmit}
          disabled={isLicenseChecked ? false : true}
          className="green"
        >{isRequest ? <CircularProgress size={20} color={'inherit'} /> : 'Login'}</SubmitButton>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </AuthForm>
      <Separator>OR</Separator>
      <LinkBlock>
        Don’t have an account?  <Link to="/registration">Register!</Link>
      </LinkBlock>
    </>
  )
}

type StateProps = Pick<Props, 'loginErrorMessage' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  loginErrorMessage: selectors.authorization.loginErrorMessage(state),
  isLogged: selectors.authorization.isLogged(state),
})

type DispatchProps = Pick<Props, 'onLogin' | 'resetLoginFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogin: (data: ApiTypes.Login) => dispatch(Actions.authorization.loginRequest(data)),
  resetLoginFailedMessage: () => dispatch(Actions.authorization.resetLoginFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
