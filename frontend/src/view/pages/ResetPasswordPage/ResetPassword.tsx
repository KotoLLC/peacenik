import React, { FormEvent, useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { validate } from '@services/validation'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import queryString from 'query-string'
import {
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  ContainerStyled,
  Header,
} from './styles'
import { ApiTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'

type FieldsType = 'password' | ''

export interface Props extends RouteComponentProps {
  passwordErrorMessage: string
  isResetPasswordSuccess: boolean

  onResetPasswordRequest: (data: ApiTypes.ResetPassword) => void
  onCleanPasswordFailedMessage: () => void
}

export const ResetPassword = (props) => {
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

    if (isResetPasswordSuccess) {
      history.push('/')
    }

    setRequest(false)

  }, [passwordErrorMessage, onResetPasswordRequest, isResetPasswordSuccess, history])

  return (
    <ContainerStyled maxWidth="sm">
      <Header>
        <Typography variant="subtitle1" gutterBottom>Enter your new password</Typography>
      </Header>
      <FormWrapper onSubmit={onFormSubmit}>
        <FormControlStyled variant="outlined">
          <InputLabel
            htmlFor="password"
            color={(noValideField === 'password') ? 'secondary' : 'primary'}
          >New password</InputLabel>
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            error={(noValideField === 'password') ? true : false}
            labelWidth={110}
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
          {isRequest ? <CircularProgress size={25} color={'inherit'} /> : 'Save'}
        </ButtonStyled>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </FormWrapper>
    </ContainerStyled>
  )
}
