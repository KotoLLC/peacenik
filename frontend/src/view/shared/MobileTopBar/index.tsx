import React, { useState } from 'react'
import { connect } from 'react-redux'
import CustomDropdownMenu from '../CustomDropdownMenu'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import logoMobile from './../../../assets/images/icon.png'
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  NavigationsWrapper,
  BadgeStyled,
  Logo,
  MenuItem,
  MenuLink,
  MobileTopBarWrapper,
  HamburgerMenu,
  HamburgerMenuItem,
  HamburgerMenuLink,
  HamburgerButton,
} from './styles'

interface Props {
  userId: string
  notificationsUnread: ApiTypes.Notifications.Notification[]
}

const MobileTopBar: React.FC<Props> = React.memo((props) => {
  const [isHamburgerMenuOpen, openHamburgerMenu] = useState<boolean>(false)
  const { notificationsUnread, /*userId*/ } = props

  return (
    <MobileTopBarWrapper>
      <Link to="/messages">
        <Logo src={logoMobile} />
      </Link>

      <ClickAwayListener onClickAway={() => { openHamburgerMenu(false) }}>
        <NavigationsWrapper>
          <HamburgerButton onClick={() => openHamburgerMenu(!isHamburgerMenuOpen)}>
            {isHamburgerMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </HamburgerButton>

          {isHamburgerMenuOpen &&
            <HamburgerMenu>
              <HamburgerMenuItem>
                <HamburgerMenuLink
                  to="/messages"
                  onClick={() => openHamburgerMenu(false)}>
                  <HomeIcon className="icon" />
                Messages
              </HamburgerMenuLink>
              </HamburgerMenuItem>
              <HamburgerMenuItem>
                <HamburgerMenuLink
                  to="/hubs"
                  onClick={() => openHamburgerMenu(false)}>
                  <ChatBubbleIcon className="icon" />
                Message Hubs
              </HamburgerMenuLink>
              </HamburgerMenuItem>
              <HamburgerMenuItem>
                <HamburgerMenuLink
                  to="/friends"
                  onClick={() => openHamburgerMenu(false)}>
                  <PeopleAltIcon className="icon" />
                Friends
              </HamburgerMenuLink>
              </HamburgerMenuItem>
              <HamburgerMenuItem>
                <HamburgerMenuLink
                  to={`/profile/me`}
                  onClick={() => openHamburgerMenu(false)}> {/*`/profile/user?id=${userId}`*/}
                  <PersonIcon className="icon" />
                Profile
              </HamburgerMenuLink>
              </HamburgerMenuItem>
              <HamburgerMenuItem>
                <HamburgerMenuLink 
                  to={`/groups/my`}
                  onClick={() => openHamburgerMenu(false)}
                  >
                  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H24V24H0V0Z" stroke="black" strokeOpacity="0.0117647" strokeWidth="0" />
                    <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M12.5058 10C14.4457 10 16 8.43667 16 6.5C16 4.56333 14.4457 3 12.5058 3C10.5659 3 9 4.56333 9 6.5C9 8.43667 10.5659 10 12.5058 10ZM12.5 12C10.0036 12 5 13.56 5 16.6667V21H20V16.6667C20 13.56 14.9964 12 12.5 12Z" />
                    <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M6.65043 12.0504C4.01921 12.3403 0 13.8823 0 16.6667V21H3.5V16.6667C3.5 14.7154 4.8094 13.1264 6.65043 12.0504ZM5 21H15V16.6667C15 14.423 12.3903 12.9861 10 12.3609C7.60969 12.9861 5 14.423 5 16.6667V21ZM8.72695 3.21773C8.34739 3.07691 7.9361 3 7.50584 3C5.56594 3 4 4.56333 4 6.5C4 8.43667 5.56594 10 7.50584 10C7.9361 10 8.34739 9.92309 8.72695 9.78227C7.96248 8.90462 7.5 7.7572 7.5 6.5C7.5 5.2428 7.96248 4.09538 8.72695 3.21773ZM10.0029 4.04651C9.3822 4.67756 9 5.54322 9 6.5C9 7.45678 9.3822 8.32244 10.0029 8.95349C10.6207 8.32244 11 7.45678 11 6.5C11 5.54322 10.6207 4.67756 10.0029 4.04651Z" />
                    <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M21.5 21H24V16.6667C24 14.3446 21.2047 12.8867 18.7503 12.2983C20.3777 13.3643 21.5 14.8602 21.5 16.6667V21ZM9 21V16.6667C9 14.2653 11.9896 12.788 14.5 12.241C17.0104 12.788 20 14.2653 20 16.6667V21H9ZM16.0999 9.97692C16.2331 9.99217 16.3685 10 16.5058 10C18.4457 10 20 8.43667 20 6.5C20 4.56333 18.4457 3 16.5058 3C16.3685 3 16.2331 3.00783 16.0999 3.02308C16.9676 3.92215 17.5 5.1474 17.5 6.5C17.5 7.8526 16.9676 9.07785 16.0999 9.97692ZM14.5039 9.37576C15.4103 8.74425 16 7.69295 16 6.5C16 5.30705 15.4103 4.25575 14.5039 3.62424C13.5942 4.25575 13 5.30705 13 6.5C13 7.69295 13.5942 8.74425 14.5039 9.37576Z" />
                  </svg>
                Groups
              </HamburgerMenuLink>
              </HamburgerMenuItem>
            </HamburgerMenu>
          }

          <MenuItem>
            <MenuLink to="/notifications">
              <BadgeStyled badgeContent={notificationsUnread.length} color="secondary">
                <NotificationsActiveIcon />
              </BadgeStyled>
            </MenuLink>
          </MenuItem>
          <CustomDropdownMenu />
        </NavigationsWrapper>
      </ClickAwayListener>
    </MobileTopBarWrapper>
  )
})

type StateProps = Pick<Props, 'notificationsUnread' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notificationsUnread: selectors.notifications.notificationsUnread(state),
  userId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(MobileTopBar)
