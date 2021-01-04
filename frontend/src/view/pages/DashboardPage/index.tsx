import React from 'react'
import { PageLayout } from '@view/shared/PageLayout'
import { ContainerStyled } from './styles'
import ObjectionableContent from './ObjectionableContent'

export const DashboardPage = () => {

  return (
    <PageLayout>
      <ContainerStyled maxWidth="md">
        <ObjectionableContent/>
      </ContainerStyled>
    </PageLayout>
  )
}