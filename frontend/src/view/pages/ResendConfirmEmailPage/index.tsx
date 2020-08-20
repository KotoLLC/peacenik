import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { RouteComponentProps } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import selectors from '@selectors/index' 
import { useLastLocation } from 'react-router-last-location'
import {
  PageWrapper,
  PaperStyled,
  ButtonsWrapper,
  ButtonStyled,
  LogoutWrapper,
} from './styles'

interface Props extends RouteComponentProps {
  isLogged: boolean
  isEmailConfirmed: boolean

  onLogout: () => void
  onSendConfirmLink: () => void
}

export const ResendConfirmEmail: React.SFC<Props> = React.memo((props) => {
  const {isEmailConfirmed, isLogged, history} = props
  
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
    <>
      <LogoutWrapper>
        <Tooltip title={`Logout`}>
          <IconButton onClick={onLogoutClick}>
            <ExitToAppIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </LogoutWrapper>
      <PageWrapper>
        <PaperStyled>
          <Typography variant="h5" component="h5" gutterBottom align="center">
            Welcome to Koto!
        </Typography>
          <Typography variant="body1" gutterBottom align="center">
          Please check your mail, we sent you an e-mail to confirm your registration. If the email doesn't come, please click on the button below.
        </Typography>
          <ButtonsWrapper>
            <ButtonStyled
              onClick={props.onSendConfirmLink}
              variant="contained"
              color="primary">
              resend confirmation email
            </ButtonStyled>
          </ButtonsWrapper>
        </PaperStyled>
      </PageWrapper>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResendConfirmEmail)
