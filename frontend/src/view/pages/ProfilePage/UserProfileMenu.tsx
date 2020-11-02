import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import VpnLockIcon from '@material-ui/icons/VpnLock'
import BlockUserDialog from '@view/pages/ProfilePage/BlockUserDialog'
import UnfriendDialog from './UnfriendDialog'
import Tooltip from '@material-ui/core/Tooltip'
import { UserMenuWrapper } from './styles'
import MenuItem from '@material-ui/core/MenuItem'

interface Props {
  userId: string
  userName: string
}

export const UserProfileMenu: React.FC<Props> = React.memo((props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const onMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onMenuClose = () => {
    setAnchorEl(null)
  }

  const { userId, userName } = props

  return (
    <UserMenuWrapper>
      <Tooltip title={`User menu`}>
        <IconButton onClick={onMenuClick}>
          <VpnLockIcon />
        </IconButton>
      </Tooltip>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem>
          <UnfriendDialog userId={userId as string} userName={userName} />
        </MenuItem>
        <MenuItem>
          <BlockUserDialog userId={userId as string} />
        </MenuItem>
      </Menu>
    </UserMenuWrapper>
  )
})