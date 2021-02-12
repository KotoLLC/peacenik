import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { RouteComponentProps } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import queryString from 'query-string'
import selectors from '@selectors/index'
import {
  AuthWrapper,
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
  isConfirmUserSuccess: boolean

  onLogout: () => void
  onUserConfirm: (data: ApiTypes.Token) => void
}

const ConfirmUserPage: React.FC<Props> = React.memo((props) => {

  const {
    isEmailConfirmed,
    isLogged,
    history,
    isConfirmUserSuccess,
  } = props

  useEffect(() => {
    if (isLogged === false) {
      history.push('/login')
    }

    if (isConfirmUserSuccess === true) {
      props.onLogout()
    }

    if (isEmailConfirmed === true) {
      history.push('/messages')
    }

  }, [isLogged, history, isEmailConfirmed, isConfirmUserSuccess, props])

  const url = props.location.search
  const params = queryString.parse(url)
  const token = params.token

  if (token) {
    props.onUserConfirm({ token: token } as ApiTypes.Token)
  }

  return (
    <AuthWrapper>
      <AuthForm>
        <CloseButton onClick={() => history.push('/login')}>
          <CloseIcon />
        </CloseButton>
        <AuthTitle>Welcome to</AuthTitle>
        <WelcomeLogoWrapper>
          <LogoImage src={logo} />
        </WelcomeLogoWrapper>
        <ConfirmMessage>
          {token ? 'Please wait...' : 'No params in url'}
        </ConfirmMessage>
      </AuthForm>
    </AuthWrapper>
  )
})

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed' | 'isConfirmUserSuccess'>
const mapStateToProps = (state): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
  isConfirmUserSuccess: selectors.registration.isConfirmUserSuccess(state),
})

type DispatchProps = Pick<Props, 'onLogout' | 'onUserConfirm'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
  onUserConfirm: (data: ApiTypes.Token) => dispatch(Actions.registration.confirmUserRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmUserPage)
