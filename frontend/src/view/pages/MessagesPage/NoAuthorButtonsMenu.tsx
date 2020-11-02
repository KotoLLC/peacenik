import React, { useState } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ComplainContentDialog from './ComplainContentDialog'
import HideMessageDialog from './HideMessageDialog'
import MenuItem from '@material-ui/core/MenuItem'

interface Props {
  sourceHost: string
  message: string
  id: string
}

export const NoAuthorButtonsMenu: React.FC<Props> = React.memo((props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const onMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onMenuClose = () => {
    setAnchorEl(null)
  }

  const {
    sourceHost,
    message,
    id,
  } = props

  return (
    <>
      <IconButton onClick={onMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem>
          <HideMessageDialog {...{ id, sourceHost }} />
        </MenuItem>
        <MenuItem>
          <ComplainContentDialog {...{ message, id, sourceHost }} />
        </MenuItem>
      </Menu>
    </>
  )
})