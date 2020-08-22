import React, { FormEvent, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { validate } from '@services/validation'
import { FooterMenu } from '@view/shared/FooterMenu'
import { ApiTypes } from 'src/types'
import logo from './../../../assets/images/logo-black.png'
import queryString from 'query-string'
import {
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  ContainerStyled,
  Header,
  Logo,
} from './styles'

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

export const RegistrationForm: React.SFC<Props> = (props) => {

  const url = props.location.search
  const params = queryString.parse(url)

  const [username, onNameChange] = useState<string>('')
  const [email, onEmailChange] = useState<string>(params?.email as string || '')
  const [password, onPasswordChange] = useState<string>('')
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
  }, [location, history, registrationErrorMessage, isRegisterSuccess, isUserRegisteredResult, isLogged])

  return (
    <ContainerStyled maxWidth="sm">
      <Header>
        <Logo src={logo} />
        <Typography variant="subtitle1" gutterBottom>Koto is a safe, friendly, distributed social  network.</Typography>
      </Header>
      <FormWrapper onSubmit={onFormSubmit}>
        <FormControlStyled variant="outlined">
          <InputLabel
            htmlFor="username"
            color={(noValideField === 'username') ? 'secondary' : 'primary'}
          >User Name</InputLabel>
          <OutlinedInput
            id="username"
            type={'text'}
            value={username}
            error={(noValideField === 'username') ? true : false}
            onChange={(event) => onNameChange(event.currentTarget.value.trim())}
            labelWidth={80}
          />
        </FormControlStyled>
        <FormControlStyled variant="outlined">
          <InputLabel
            htmlFor="email"
            color={(noValideField === 'email') ? 'secondary' : 'primary'}
          >Email</InputLabel>
          <OutlinedInput
            id="email"
            type={'text'}
            value={email}
            error={(noValideField === 'email') ? true : false}
            onChange={(event) => onEmailChange(event.currentTarget.value.trim())}
            labelWidth={40}
          />
        </FormControlStyled>
        <FormControlStyled variant="outlined">
          <InputLabel
            htmlFor="password"
            color={(noValideField === 'password') ? 'secondary' : 'primary'}
          >Password</InputLabel>
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            error={(noValideField === 'password') ? true : false}
            labelWidth={70}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onPasswordOpen(!isPasswordVisible)}
                  onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
                  edge="end"
                >
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            } />
        </FormControlStyled>
        <ButtonStyled
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={onFormSubmit}
        >
          {isRequest ? <CircularProgress size={25} color={'inherit'} /> : 'Register'}
        </ButtonStyled>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </FormWrapper>
      <FooterMenu menuItems={[
        {
          title: 'Login for Koto',
          to: '/login'
        },
        {
          title: 'About Koto',
          to: '/about-us',
        },
        {
          title: 'Code of conduct',
          to: '/docs/code-of-conduct'
        },
        {
          title: 'Contact us',
          href: 'https://docs.koto.at/#/help',
        },
      ]} />
    </ContainerStyled>
  )
}
