import React, { FormEvent, useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { validate } from '@services/validation'
import { FooterMenu } from '@view/shared/FooterMenu'
import { 
  FormWrapper, 
  FormControlStyled, 
  ButtonStyled, 
  ContainerStyled, 
  Header,
 } from './styles'
import { ApiTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'

type FieldsType = 'username' | 'email' | ''

export interface Props extends RouteComponentProps {
  passwordErrorMessage: string
  isForgotPasswordSent: boolean
  onResetPasswordRequest: (data: ApiTypes.ResetPassword) => void
  onCleanPasswordFailedMessage: () => void
}

export const ForgotPassword = (props) => {
  const [username, onUsernameChange] = useState<string>('')
  const [email, onEmailChange] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)
  
  const {passwordErrorMessage, onResetPasswordRequest, isForgotPasswordSent } = props

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
    <ContainerStyled maxWidth="sm">
      <Header>
        <Typography variant="subtitle1" gutterBottom>To send a request to change your password, fill out the following fields.</Typography>
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
            onChange={(event) => onUsernameChange(event.currentTarget.value.trim())}
            labelWidth={85}
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
        <ButtonStyled
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={onFormSubmit}
        >
          {isRequest ? <CircularProgress size={25} color={'inherit'} /> : 'Send'}
        </ButtonStyled>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </FormWrapper>
      <FooterMenu menuItems={[
        {
          title: 'Login for Koto',
          to: '/login'
        },
        {
          title: 'Register for Koto',
          to: '/registration',
        },
      ]} />
    </ContainerStyled>
  )
} 
