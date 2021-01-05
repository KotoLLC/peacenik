import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import PeopleIcon from '@material-ui/icons/People'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DnsIcon from '@material-ui/icons/Dns'
import ForumIcon from '@material-ui/icons/Forum'
// import NotificationsIcon from '@material-ui/icons/Notifications'
// import HelpIcon from '@material-ui/icons/Help'
// import DescriptionIcon from '@material-ui/icons/Description'
import { connect } from 'react-redux'
import { ListItemIconStyled, AvatarWrapper } from './styles'
import { history } from '@view/routes'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Avatar from '@material-ui/core/Avatar'
import { getAvatarUrl } from '@services/avatarUrl'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import DeckIcon from '@material-ui/icons/Deck'

interface Props {
  userId: string

  onLogout: () => void
}

const TopMenu: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { userId } = props

  const onMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onMenuClose = () => {
    setAnchorEl(null)
  }

  const goToPage = (path: string) => {
    history.push(path)
    setAnchorEl(null)
  }

  const onLogoutClick = () => {
    localStorage.clear()
    sessionStorage.clear()
    history.push('/login')
    props.onLogout()
  }

  return (
    <div>
      <AvatarWrapper onClick={onMenuClick}>
        <Avatar src={getAvatarUrl(userId)} />
      </AvatarWrapper>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem onClick={() => goToPage('/messages')}>
          <ListItemIconStyled>
            <ForumIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Messages" />
        </MenuItem>
        {/* <MenuItem onClick={() => goToPage('/groups')}>
          <ListItemIconStyled>
            <DeckIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Groups" />
        </MenuItem> */}
        <MenuItem onClick={() => goToPage('/friends/all')}>
          <ListItemIconStyled>
            <PeopleIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Friends" />
        </MenuItem>
        <MenuItem onClick={() => goToPage('/profile/me')}>
          <ListItemIconStyled>
            <AccountCircleIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => goToPage('/hubs/create')}>
          <ListItemIconStyled>
            <DnsIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Message Hubs" />
        </MenuItem>
        <MenuItem onClick={onLogoutClick}>
          <ListItemIconStyled>
            <ExitToAppIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </div>
  )
}

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu)
