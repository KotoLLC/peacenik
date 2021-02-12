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

type FieldsType = 'email' | ''

export interface Props extends RouteComponentProps {
  isForgotUserNameSent: boolean

  onUserNameRequest: (data: ApiTypes.ForgotUserName) => void
}

export const ForgotUserName = (props) => {
  const [email, onEmailChange] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)

  const { onUserNameRequest, isForgotUserNameSent } = props

  const onValidate = (): boolean => {

    if (!validate.isEmailValid(email)) {
      setErrorMessage('Email is incorrect')
      setNoValideField('email')
      return false
    }

    return true
  }

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!onValidate()) return

    setRequest(true)
    setErrorMessage('')
    setNoValideField('')
    onUserNameRequest({ email })
  }

  useEffect(() => {
    setRequest(isForgotUserNameSent)
  }, [
    onUserNameRequest,
    isForgotUserNameSent,
  ])

  return (
    <ContainerStyled maxWidth="sm">
      <Header>
        <Typography variant="subtitle1" gutterBottom>To send a reminder request to username, please fill in the following field.</Typography>
      </Header>
      <FormWrapper onSubmit={onFormSubmit}>
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
          title: 'Login for Peacenik',
          to: '/login'
        },
        {
          title: 'Register for Peacenik',
          to: '/registration',
        },
      ]} />
    </ContainerStyled>
  )
} 
