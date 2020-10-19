import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import TopMenu from './TopMenu'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
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
  notificationLength: number
  userId: string
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const { notificationLength, userId } = props

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <LogoWrapper to="/messages">
          <Logo src={logo} />
          <LogoMobile src={logoMobile} />
        </LogoWrapper>
        <TopBarRightSide>
          {<NotificationsWrapper to="/notifications">
            <Badge badgeContent={notificationLength} color="secondary">
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

type StateProps = Pick<Props, 'notificationLength' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notificationLength: selectors.notifications.notificationLength(state),
  userId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(TopBar)
