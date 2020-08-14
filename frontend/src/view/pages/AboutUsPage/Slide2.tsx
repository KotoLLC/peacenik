import React from 'react'
import Typography from '@material-ui/core/Typography'
import demoPicture from './../../../assets/images/1-social-graph.png'
import { 
  ContainerStyled,
  ImageDemo,
 } from './styles'

export const Slide2 = () => {
  return (
    <ContainerStyled maxWidth="md">
      <Typography variant="h3" gutterBottom>Social grapph</Typography>
      <ImageDemo src={demoPicture} alt="social grapph" />
    </ContainerStyled>
  )
}