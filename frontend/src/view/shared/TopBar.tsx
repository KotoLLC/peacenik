import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import TopMenu from './TopMenu'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import logo from './../../assets/images/logo-white.png'
import logoMobile from './../../assets/images/koto-logo-mobile.png'
import Badge from '@material-ui/core/Badge'

import {
  LogoWrapper,
  TopBarRightSide,
  NotificationsWrapper,
  Logo,
  LogoMobile,
} from './styles'

interface Props {
  notificationsUnread: ApiTypes.Notifications.Notification[]
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const { notificationsUnread } = props
  
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <LogoWrapper to="/messages">
          <Logo src={logo} />
          <LogoMobile src={logoMobile} />
        </LogoWrapper>
        <TopBarRightSide>
          {<NotificationsWrapper to="/notifications">
            <Badge badgeContent={notificationsUnread.length} color="secondary">
              <NotificationsActiveIcon />
            </Badge>
          </NotificationsWrapper>}
          <TopMenu />
        </TopBarRightSide>
      </Toolbar>
    </AppBar>
  )
})

type StateProps = Pick<Props, 'notificationsUnread'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notificationsUnread: selectors.notifications.notificationsUnread(state),
})

export default connect(mapStateToProps)(TopBar)
