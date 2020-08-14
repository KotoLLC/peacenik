import React from 'react'
import { ContainerStyled } from './styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

interface Props {
  onGoToNodes: () => void
}

export const Slide1: React.FC<Props> = (props) => {
  return (
    <ContainerStyled maxWidth="lg">
      <Typography variant="h3" gutterBottom>Description Koto</Typography>
      <Typography variant="subtitle1" gutterBottom>Koto is a safe, friendly, distributed social network.</Typography>
      <Button variant="contained" color="primary" onClick={props.onGoToNodes}>create node</Button>
    </ContainerStyled>
  )
}