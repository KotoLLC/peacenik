import React from 'react'
import { ContainerStyled } from './styles'
import Typography from '@material-ui/core/Typography'

export const Slide2 = () => {
  return (
    <ContainerStyled maxWidth="md">
      <Typography variant="h3" gutterBottom>Some image</Typography>
      <img src="https://picsum.photos/id/10/400/300" alt="img" />
    </ContainerStyled>
  )
}