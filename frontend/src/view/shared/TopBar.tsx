import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ButtonStyled } from './styles'

export const TopBar: React.SFC = React.memo(() => (
  <AppBar position="fixed" color="primary">
    <Toolbar>
      <Typography variant="h6">Koto</Typography>
      <ButtonStyled color="inherit">Logout</ButtonStyled>
    </Toolbar>
  </AppBar>
))