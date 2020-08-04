import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { TopMenu } from './TopMenu'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { history } from '@view/routes'
import selectors from '@selectors/index'
import { StoreTypes } from './../../types'
import { 
  TooltipStyle, 
  IconButtonStyled, 
  LogoWrapper, 
  TopBarRightSide,
  NotificationsCounter,
  NotificationsWrapper,
} from './styles'

interface Props {
  notificationLength: number
  onLogout: () => void
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const { notificationLength } = props

  const onLogoutClick = () => {
    history.push('/login')    
    props.onLogout()
  }

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <LogoWrapper to="/messages">Koto</LogoWrapper>
        <TopBarRightSide>
          {Boolean(notificationLength) && <NotificationsWrapper to="/notifications">
            <NotificationsActiveIcon fontSize="small"/>
            <NotificationsCounter>{notificationLength} notifications</NotificationsCounter>
          </NotificationsWrapper>}
          <TopMenu />
          <TooltipStyle title={`Logout`}>
            <IconButtonStyled onClick={onLogoutClick}>
              <ExitToAppIcon fontSize="small" />
            </IconButtonStyled>
          </TooltipStyle>
        </TopBarRightSide>
      </Toolbar>
    </AppBar>
  )
})

type StateProps = Pick<Props, 'notificationLength'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notificationLength: selectors.notifications.notificationLength(state),
})

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
