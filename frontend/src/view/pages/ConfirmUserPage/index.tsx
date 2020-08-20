import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { RouteComponentProps } from 'react-router-dom'
import { ApiTypes } from 'src/types'
import queryString from 'query-string'
import selectors from '@selectors/index' 
import CircularProgress from '@material-ui/core/CircularProgress'
import { useLastLocation } from 'react-router-last-location'
import {
  PageWrapper,
  PaperStyled,
  PreloaderWrapper,
} from './styles'

interface Props extends RouteComponentProps {
  isLogged: boolean
  isEmailConfirmed: boolean
  isConfirmUserSuccess: boolean

  onLogout: () => void
  onUserConfirm: (data: ApiTypes.Token) => void
}

export const ConfirmUser: React.SFC<Props> = React.memo((props) => {
  const {
    isEmailConfirmed, 
    isLogged, 
    history, 
    isConfirmUserSuccess,
  } = props

  const lastLocation = useLastLocation()
  const lastLoactionPathname = lastLocation?.pathname

  useEffect(() => {
    if (isLogged === false) {
      history.push('/login')
    }

    if (isConfirmUserSuccess === true) {
      props.onLogout()
    }

    if (isEmailConfirmed === true) {
      history.push(lastLoactionPathname ? lastLoactionPathname : '/messages')
    }

  }, [isLogged, history, isEmailConfirmed, isConfirmUserSuccess, props, lastLoactionPathname])

  const url = props.location.search
  const params = queryString.parse(url)
  const token = params.token

  if (token) {
    props.onUserConfirm({ token: token } as ApiTypes.Token)
  } 

  return (
    <>
      <PageWrapper>
        <PaperStyled>
        <Typography variant="h6" component="h5" gutterBottom align="center">Please wait...</Typography>
          <PreloaderWrapper>
            {token ? <CircularProgress/> : 'No params in url'}
          </PreloaderWrapper>
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

type DispatchProps = Pick<Props, 'onLogout'| 'onUserConfirm'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
  onUserConfirm: (data: ApiTypes.Token) => dispatch(Actions.registration.confirmUserRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmUser)
