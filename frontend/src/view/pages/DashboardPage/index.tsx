import React from 'react'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled } from './styles'
import ObjectionableContent from './ObjectionableContent'

export const DashboardPage = () => {

  return (
    <WithTopBar>
      <ContainerStyled maxWidth="md">
        <ObjectionableContent/>
      </ContainerStyled>
    </WithTopBar>
  )
}