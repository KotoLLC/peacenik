import React, { ChangeEvent, FormEvent } from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import i18n from '@view/i18n'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Footer } from './Menu'

interface State {
  email: string
  password: string
  isPasswordVisible: boolean
  isRequested: boolean
}

export class LoginPage extends React.PureComponent<{}, State> {

  state = {
    email: '',
    password: '',
    isPasswordVisible: false,
    isRequested: false,
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

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    
    this.setState({
      isRequested: true,
    })
    // const { email, password } = this.state
  }

  render() {
    const { password, email, isPasswordVisible, isRequested } = this.state

    return (
      <ContainerStyled maxWidth="sm">
        <Header>
          <Typography variant="h3" gutterBottom>Koto</Typography>
          <Typography variant="subtitle1" gutterBottom>{i18n.login.description}</Typography>
        </Header>
        <Form onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="email">{i18n.login.form.email}</InputLabel>
            <OutlinedInput
              id="email"
              type={'text'}
              value={email}
              // error
              onChange={this.onEmailChange}
              labelWidth={70}
            />
          </FormControlStyled>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="password">{i18n.login.form.password}</InputLabel>
            <OutlinedInput
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={this.onPasswordChange}
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
               {isRequested ? <CircularProgress size={25} color={'inherit'}/> : i18n.login.form.login}
            </ButtonStyled>
        </Form>
        <Footer />
      </ContainerStyled>
    )
  }
}

const Form = styled.form`
  width: 280px;
  margin: 0 auto;
`

const FormControlStyled = styled(FormControl)`
  && {
    margin: 10px 0; 
    width: 100%;
  }
`

const ButtonStyled = styled(Button)`
  && {
    width: 100%;
    height: 42px;
  }
`

const ContainerStyled = styled(Container)`
  && {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    min-height: 100vh;
  }
`

const Header = styled.div`
  padding-bottom: 30px;
  text-align: center;
`
