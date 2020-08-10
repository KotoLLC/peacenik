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
import { FooterMenu } from '@view/shared/FooterMenu'
import { FormWrapper, FormControlStyled, ButtonStyled, ContainerStyled, Header } from './styles'
import { ApiTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'

type FieldsType = 'username' | 'password' | ''

interface State {
  username: string
  password: string
  isPasswordVisible: boolean
  isRequest: boolean
  noValideField: FieldsType
  errorMessage: string
}

export interface Props extends RouteComponentProps {
  loginErrorMessage: string
  isLogged: boolean
  onLogin: (data: ApiTypes.Login) => void
  resetLoginFailedMessage: () => void
}

export class LoginForm extends React.PureComponent<Props, State> {

  state = {
    username: '',
    password: '',
    isPasswordVisible: false,
    isRequest: false,
    noValideField: '' as FieldsType,
    errorMessage: '',
  }

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.loginErrorMessage !== '') {
      return {
        errorMessage: nextProps.loginErrorMessage,
        isRequest: false
      }
    } if (nextProps.isLogged === true) {
      nextProps.history.push('/messages')
      return { isRequest: false }
    } else {
      return {}
    }
  }

  onEmailChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      username: event.currentTarget.value.trim()
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
    const { password, username } = this.state

    if (!validate.isUserNameValid(username)) {
      this.setState({
        errorMessage: 'User Name / email is incorrect',
        noValideField: 'username',
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
    const { username, password } = this.state
    const { onLogin } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequest: true,
      errorMessage: '',
      noValideField: '',
    })

    onLogin({ name: username, password })
  }

  componentWillUnmount() {
    this.props.resetLoginFailedMessage()
  }

  render() {
    const {
      password,
      username,
      isPasswordVisible,
      isRequest,
      errorMessage,
      noValideField,
    } = this.state

    return (
      <ContainerStyled maxWidth="sm">
        <Header>
          <Typography variant="h3" gutterBottom>Koto</Typography>
          <Typography variant="subtitle1" gutterBottom>Koto is a safe, friendly, distributed social  network.</Typography>
        </Header>
        <FormWrapper onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel 
              htmlFor="username"
              color={(noValideField === 'username') ? 'secondary' : 'primary'}
              >User Name / Email</InputLabel>
            <OutlinedInput
              id="username"
              type={'text'}
              value={username}
              error={(noValideField === 'username') ? true : false}
              onChange={this.onEmailChange}
              labelWidth={135}
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
            {isRequest ? <CircularProgress size={25} color={'inherit'} /> : 'Login'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
        <FooterMenu menuItems={[
          {
            title: 'Forgotten password',
            to: '/',
            disabled: true,
          },
          {
            title: 'Register for Koto',
            to: '/registration',
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
            to: '/',
            disabled: true
          },
        ]} />
      </ContainerStyled>
    )
  }
}
