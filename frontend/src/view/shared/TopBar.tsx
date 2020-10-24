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
import { getAvatarUrl } from '@services/avatarUrl'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'

import {
  LogoWrapper,
  TopBarRightSide,
  NotificationsWrapper,
  AvatarWrapper,
  Logo,
  LogoMobile,
} from './styles'

interface Props {
  notificationsUnread: ApiTypes.Notifications.Notification[]
  userId: string
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const { notificationsUnread, userId } = props
  
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
          <AvatarWrapper to="/profile/me">
            <Avatar src={getAvatarUrl(userId)} />
          </AvatarWrapper>
        </TopBarRightSide>
      </Toolbar>
    </AppBar>
  )
})

type StateProps = Pick<Props, 'notificationsUnread' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notificationsUnread: selectors.notifications.notificationsUnread(state),
  userId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(TopBar)
