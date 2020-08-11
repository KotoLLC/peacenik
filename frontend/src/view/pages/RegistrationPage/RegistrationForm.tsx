import React, { ChangeEvent, FormEvent } from 'react'
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
  onRegisterUser: (data: ApiTypes.RegisterUser) => void
  onResetRegistrationResult: () => void
}

interface State {
  username: string
  email: string
  password: string
  isPasswordVisible: boolean
  isRequest: boolean
  noValideField: FieldsType
  errorMessage: string
}

export class RegistrationForm extends React.PureComponent<Props, State> {

  state = {
    username: '',
    email: '',
    password: '',
    isPasswordVisible: false,
    isRequest: false,
    noValideField: '' as FieldsType,
    errorMessage: '',
  }

  static getDerivedStateFromProps(nextProps: Props) {

    if (nextProps.isRegisterSuccess === true) {
      nextProps.history.push('/confirm-user')
      return { 
        isRequest: false 
      }
    } 

    if (nextProps.registrationErrorMessage !== '') {
      return {
        errorMessage: nextProps.registrationErrorMessage,
        isRequest: false
      }
    } else {
      return {}
    }
  }

  onNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      username: event.currentTarget.value.trim(),
      errorMessage: '',
    })
  }
  
  onEmailChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      email: event.currentTarget.value.trim(),
      errorMessage: '',
    })
  }

  onPasswordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      password: event.currentTarget.value.trim(),
      errorMessage: '',
    })
  }

  onPasswordOpen = () => {
    this.setState({
      isPasswordVisible: !this.state.isPasswordVisible
    })
  }

  onValidate = (): boolean => {
    const { password, username, email } = this.state
    
    if (!validate.isUserNameValid(username)) {
      this.setState({
        errorMessage: 'Your username contains invalid characters, allowed: a-z A-Z 0-9 @ . -',
        noValideField: 'username',
      })
      return false
    }

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
    const { username, password, email } = this.state
    const { onRegisterUser } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequest: true,
      errorMessage: '',
      noValideField: '',
    })

    onRegisterUser({ name: username, password, email })
  }

  componentWillUnmount() {
    this.props.onResetRegistrationResult()
  }

  render() {
    const {
      password,
      username,
      email,
      isPasswordVisible,
      isRequest,
      errorMessage,
      noValideField,
    } = this.state

    return (
      <ContainerStyled maxWidth="sm">
        <Header>
          <Logo src={logo}/>
          <Typography variant="subtitle1" gutterBottom>Koto is a safe, friendly, distributed social  network.</Typography>
        </Header>
        <FormWrapper onSubmit={this.onFormSubmit}>
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
              onChange={this.onNameChange}
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
              onChange={this.onEmailChange}
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
            to: '/',
            disabled: true
          },
        ]} />
      </ContainerStyled>
    )
  }
}
