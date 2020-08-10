import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { RouteComponentProps } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import queryString from 'query-string'
import selectors from '@selectors/index' 
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
  isConfirmUserSuccess: boolean
  onLogout: () => void
  onSendConfirmLink: () => void
  onUserConfirm: (data: ApiTypes.Token) => void
}

export const ConfirmUser: React.SFC<Props> = React.memo((props) => {
  const {isEmailConfirmed, isLogged, history, isConfirmUserSuccess} = props
  
  const onLogoutClick = () => {
    props.onLogout()
  }

  useEffect(() => {
    if (isLogged === false) {
      history.push('/login')
    }

    if (isEmailConfirmed === true) {
      history.push('/messages')
    }

    if (isConfirmUserSuccess === true) {
      onLogoutClick()
    }

  }, [isLogged, history, isEmailConfirmed, isConfirmUserSuccess])

  const url = props.location.search
  const params = queryString.parse(url)
  const token = params.token

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
            To continue, please confirm your email address.
        </Typography>
          <ButtonsWrapper>
            <ButtonStyled
              onClick={props.onSendConfirmLink}
              variant="contained"
              color="primary">
              resend confirmation email
            </ButtonStyled>
            {token && <ButtonStyled
              onClick={() => props.onUserConfirm({ token: token } as ApiTypes.Token)}
              variant="contained"
              color="primary">
              Confirm
            </ButtonStyled>}
          </ButtonsWrapper>
        </PaperStyled>
      </PageWrapper>
    </>
  )
})

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed' | 'isConfirmUserSuccess'>
const mapStateToProps = (state): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
  isConfirmUserSuccess: selectors.registration.isConfirmUserSuccess(state),
})

type DispatchProps = Pick<Props, 'onLogout' | 'onSendConfirmLink' | 'onUserConfirm'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
  onSendConfirmLink: () => dispatch(Actions.registration.sendConfirmLinkRequest()),
  onUserConfirm: (data: ApiTypes.Token) => dispatch(Actions.registration.confirmUserRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmUser)
