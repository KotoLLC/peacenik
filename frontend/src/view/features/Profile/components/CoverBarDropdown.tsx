import React, { useState } from 'react'
import { IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import BlockUserDialog from './BlockUserDialog'
import { DotsIcon, CoverBarDropdownWrapper } from './styles'

interface Props {
  userId: string
}

export const CoverBarDropdown: React.FC<Props> = React.memo((props) => {
  const { userId } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const [isBlockUserDialogOpen, openBlockUserDialog] = useState<boolean>(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  const onBlockUserClick = () => {
    openBlockUserDialog(true)
    onClose()
  }

  return (
    <CoverBarDropdownWrapper>
      <IconButton component="span" onClick={handleClick}>
        <DotsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem onClick={onBlockUserClick}>Block user</MenuItem>
      </Menu>
      <BlockUserDialog
        isOpen={isBlockUserDialogOpen}
        userId={userId}
        setOpen={openBlockUserDialog}
      />
    </CoverBarDropdownWrapper>
  )
})