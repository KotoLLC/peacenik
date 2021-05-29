import React, { useState } from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import RemoveMessageDialog from './RemoveMessageDialog'
import { ListItemIconStyled } from '@view/shared/styles'
import { ListItemTextStyled } from './styles'

interface Props {
  isEditer: boolean
  sourceHost: string
  message: string
  id: string

  setEditor: (value: boolean) => void
}

export const AuthorButtonsMenu: React.FC<Props> = React.memo((props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const onMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const onMenuClose = () => {
    setAnchorEl(null)
  }

  const {
    isEditer,
    sourceHost,
    message,
    id,
    setEditor,
  } = props

  return (
    <>
      <IconButton onClick={onMenuClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem onClick={() => setEditor(!isEditer)}>
          <ListItemIconStyled>
            <EditIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemTextStyled primary="Edit" />
        </MenuItem>
        <RemoveMessageDialog {...{ message, id, sourceHost }} />
      </Menu>
    </>
  )
})