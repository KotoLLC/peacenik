import React from 'react'
import { ContainerStyled } from './styles'
import ObjectionableContent from './ObjectionableContent'

export const DashboardPage = () => {

  return (
    <>
      <ContainerStyled maxWidth="md">
        <ObjectionableContent/>
      </ContainerStyled>
    </>
  )
}