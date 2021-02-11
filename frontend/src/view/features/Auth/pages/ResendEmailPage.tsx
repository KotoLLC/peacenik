import React, { useEffect } from 'react'
import selectors from '@selectors/index'
import { useLastLocation } from 'react-router-last-location'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { RouteComponentProps } from 'react-router-dom'
import {
  AuthWrapper,
  SubmitButton,
  ConfirmMessage,
  AuthTitle,
  AuthForm,
  WelcomeLogoWrapper,
  LogoImage,
  CloseButton,
} from './../components/styles'
import logo from '@assets/images/logo-2.png'
import CloseIcon from '@material-ui/icons/Close'

interface Props extends RouteComponentProps {
  isLogged: boolean
  isEmailConfirmed: boolean

  onLogout: () => void
  onSendConfirmLink: () => void
}

const ResendEmailPage: React.FC<Props> = React.memo((props) => {
  const { isEmailConfirmed, isLogged, history } = props

  const onLogoutClick = () => {
    props.onLogout()
  }

  const lastLocation = useLastLocation()
  const lastLoactionPathname = lastLocation?.pathname

  useEffect(() => {
    if (isLogged === false) {
      history.push('/login')
    }

    if (isEmailConfirmed === true) {
      history.push(lastLoactionPathname ? lastLoactionPathname : '/messages')
    }

  }, [isLogged, history, isEmailConfirmed, lastLoactionPathname])

  return (
    <AuthWrapper>
      <AuthForm>
        <CloseButton onClick={onLogoutClick}>
          <CloseIcon />
        </CloseButton>
        <AuthTitle>Welcome to</AuthTitle>
        <WelcomeLogoWrapper>
          <LogoImage src={logo} />
        </WelcomeLogoWrapper>
        <ConfirmMessage>
          Please check your mail, we will send you an e-mail to confirmation your registration.
          If the email doesn't come, please click on the button below
      </ConfirmMessage>
        <SubmitButton onClick={props.onSendConfirmLink}>
          Resend confirmation mail
        </SubmitButton>
      </AuthForm>
    </AuthWrapper>
  )
})

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed'>
const mapStateToProps = (state): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
})

type DispatchProps = Pick<Props, 'onLogout' | 'onSendConfirmLink'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
  onSendConfirmLink: () => dispatch(Actions.registration.sendConfirmLinkRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResendEmailPage)
