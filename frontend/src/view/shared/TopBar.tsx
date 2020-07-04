import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { TooltipStyle, IconButtonStyled, TypographyStyled } from './styles'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequest()),
})

interface Props {
  onLogout: () => void
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const { onLogout } = props

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <TypographyStyled variant="h6">Koto</TypographyStyled>
        <TooltipStyle title={`Logout`}>
          <IconButtonStyled onClick={onLogout}>
            <ExitToAppIcon />
          </IconButtonStyled>
        </TooltipStyle>
      </Toolbar>
    </AppBar>
  )
})

export default connect(null, mapDispatchToProps)(TopBar)