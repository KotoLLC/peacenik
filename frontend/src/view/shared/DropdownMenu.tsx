import React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import { connect } from 'react-redux'
import { history } from '@view/routes'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Avatar from '@material-ui/core/Avatar'
import { getAvatarUrl } from '@services/avatarUrl'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import PersonIcon from '@material-ui/icons/Person'
import {
  ListItemIconStyled,
  AvatarWrapper,
  MenuItemStyled,
  MenuStyled,
} from './styles'

interface Props {
  userId: string

  onLogout: () => void
}

const CustomDropdownMenu: React.FC<Props> = (props) => {
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
      <MenuStyled
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItemStyled onClick={() => goToPage('/settings')}>
          <ListItemIconStyled>
            <PersonIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Edit Profile" />
        </MenuItemStyled>
        <MenuItemStyled className="logout" onClick={onLogoutClick}>
          <ListItemIconStyled>
            <ExitToAppIcon fontSize="small" />
          </ListItemIconStyled>
          <ListItemText primary="Log out" />
        </MenuItemStyled>
      </MenuStyled>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropdownMenu)
