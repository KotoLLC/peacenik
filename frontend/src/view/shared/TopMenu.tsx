import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import PeopleIcon from '@material-ui/icons/People'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DnsIcon from '@material-ui/icons/Dns'
import ForumIcon from '@material-ui/icons/Forum'
import HelpIcon from '@material-ui/icons/Help'
import { connect } from 'react-redux'
import DescriptionIcon from '@material-ui/icons/Description'
import { ListItemIconStyled, MenuButton } from './styles'
import { history } from '@view/routes'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

interface Props {
  onLogout: () => void
}

const TopMenu: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

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
    history.push('/login')
    props.onLogout()
  }

  return (
    <div>
      <MenuButton onClick={onMenuClick}>Menu</MenuButton>
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
        <MenuItem onClick={() => goToPage('/friends/all')}>
          <ListItemIconStyled>
            <PeopleIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Friends" />
        </MenuItem>
        <MenuItem onClick={() => goToPage('/notifications')}>
          <ListItemIconStyled>
            <NotificationsIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Notifications" />
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
        <MenuItem onClick={() => goToPage('/docs/code-of-conduct')}>
          <ListItemIconStyled>
            <DescriptionIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Code of conduct" />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://docs.koto.at/#/"
          target="_blank"
        >
          <ListItemIconStyled>
            <HelpIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Help" />
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

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
})

export default connect(null, mapDispatchToProps)(TopMenu)
