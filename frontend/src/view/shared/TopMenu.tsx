import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import PeopleIcon from '@material-ui/icons/People'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DnsIcon from '@material-ui/icons/Dns'
import ForumIcon from '@material-ui/icons/Forum'
import { ListItemIconStyled, MenuButton } from './styles'
import { history } from '@view/routes'

export const TopMenu = () => {
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

  return (
    <div>
      <MenuButton onClick={onMenuClick}>Menu</MenuButton>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem>
          <ListItemIconStyled>
            <ForumIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Messages" />
        </MenuItem>
        <MenuItem onClick={() => goToPage('/friends')}>
          <ListItemIconStyled>
            <PeopleIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Friends" />
        </MenuItem>
        <MenuItem>
          <ListItemIconStyled>
            <NotificationsIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Notifications" />
        </MenuItem>
        <MenuItem>
          <ListItemIconStyled>
            <AccountCircleIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => goToPage('/nodes/create')}>
          <ListItemIconStyled>
            <DnsIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Nodes" />
        </MenuItem>
      </Menu>
    </div>
  )
}