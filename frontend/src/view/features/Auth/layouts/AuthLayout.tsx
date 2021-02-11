import React from 'react'
import logo from '@assets/images/logo-2.png'
import {
  AuthWrapper,
  LogoImage,
  LogoImageWrapper,
} from './../components/styles'

interface Props { }

export const AuthLayout: React.FC<Props> = (props) => (
  <AuthWrapper>
    <LogoImageWrapper>
      <LogoImage src={logo} alt="logo" />
    </LogoImageWrapper>
    {props.children}
  </AuthWrapper>
)