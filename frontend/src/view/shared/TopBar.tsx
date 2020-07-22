import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { TopMenu } from './TopMenu'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { 
  TooltipStyle, 
  IconButtonStyled, 
  LogoWrapper, 
  TopBarRightSide,
  NotificationsCounter,
  NotificationsWrapper,
} from './styles'

interface Props {
  onLogout: () => void
}

const TopBar: React.SFC<Props> = React.memo((props) => {

  const onLogoutClick = () => {
    localStorage.clear()
    props.onLogout()
    window.location.reload()
  }

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <LogoWrapper to="/messages">Koto</LogoWrapper>
        <TopBarRightSide>
          {false && <NotificationsWrapper to="/notifications">
            <NotificationsActiveIcon fontSize="small"/>
            <NotificationsCounter>10 notifications</NotificationsCounter>
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

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
})

export default connect(null, mapDispatchToProps)(TopBar)
