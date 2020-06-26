import React, { ChangeEvent, FormEvent } from 'react'
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
import { Footer } from './Menu'
import { FormWrapper, FormControlStyled, ButtonStyled, ContainerStyled, Header } from './styles'
import { ApiDataTypes } from './../../../types/api'

type FieldsType = '' | 'email' | 'password'

interface State {
  email: string
  password: string
  isPasswordVisible: boolean
  isRequested: boolean
  noValideField: FieldsType
  errorMessage: string
}

export interface Props {
  loginErrorMessage: string
  isLogged: boolean
  onLogin: (data: ApiDataTypes.Login) => void
}

export class LoginForm extends React.PureComponent<Props, State> {

  state = {
    email: '',
    password: '',
    isPasswordVisible: false,
    isRequested: false,
    noValideField: '' as FieldsType,
    errorMessage: '',
  }

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.loginErrorMessage != '') {
      return {
        errorMessage: nextProps.loginErrorMessage,
        isRequested: false
      }
    } if (nextProps.isLogged === true) {
      return { isRequested: false }
    } else {
      return {}
    }
  }

  onEmailChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      email: event.currentTarget.value.trim()
    })
  }

  onPasswordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      password: event.currentTarget.value.trim()
    })
  }

  onPasswordOpen = () => {
    this.setState({
      isPasswordVisible: !this.state.isPasswordVisible
    })
  }

  onValidate = (): boolean => {
    const { email, password } = this.state

    if (!validate.isEmailValid(email)) {
      this.setState({
        errorMessage: 'Email is incorrect',
        noValideField: 'email',
      })
      return false
    }

    if (!validate.isPasswordValid(password)) {
      this.setState({
        errorMessage: 'Password is incorrect',
        noValideField: 'password',
      })
      return false
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const { email, password } = this.state
    const { onLogin } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequested: true,
      errorMessage: '',
      noValideField: '',
    })

    onLogin({ email, password })
  }

  render() {
    const {
      password,
      email,
      isPasswordVisible,
      isRequested,
      errorMessage,
      noValideField,
    } = this.state

    return (
      <ContainerStyled maxWidth="sm">
        <Header>
          <Typography variant="h3" gutterBottom>Koto</Typography>
          <Typography variant="subtitle1" gutterBottom>Koto is a safe, friendly, distributed socila network.</Typography>
        </Header>
        <FormWrapper onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              type={'text'}
              value={email}
              error={(noValideField === 'email') ? true : false}
              onChange={this.onEmailChange}
              labelWidth={70}
            />
          </FormControlStyled>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={this.onPasswordChange}
              error={(noValideField === 'password') ? true : false}
              labelWidth={70}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.onPasswordOpen}
                    onMouseDown={this.onPasswordOpen}
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
            onClick={this.onFormSubmit}
          >
            {isRequested ? <CircularProgress size={25} color={'inherit'} /> : 'Login'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
        <Footer />
      </ContainerStyled>
    )
  }
}
