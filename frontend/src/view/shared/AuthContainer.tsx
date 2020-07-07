import React from 'react'
import { PageWrapper } from './styles'
import TopBar from './TopBar'

export const AuthContainer: React.SFC = (props) => (
  <PageWrapper>
    <TopBar/>
    {props.children}
  </PageWrapper>
)