import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ButtonStyled } from './styles'
import { connect } from 'react-redux'
import Actions from '@store/actions'

type DispatchProps = Pick<Props, 'onLogout'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLogout: () => dispatch(Actions.authorization.logoutRequested()),
})

interface Props {
  onLogout: () => void
}

const TopBar: React.SFC<Props> = React.memo((props) => {
  const {onLogout} = props

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6">Koto</Typography>
        <ButtonStyled color="inherit" onClick={onLogout}>Logout</ButtonStyled>
      </Toolbar>
    </AppBar>
  )
})

export default connect(null, mapDispatchToProps)(TopBar)