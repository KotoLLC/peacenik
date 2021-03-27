import React from 'react'
import LogoIconImage from '@assets/images/icon.png'
import { Container } from '@view/shared/styles'
import {
  BottomBarWrapper,
  CopyrightWrapper,
  FooterWrapper,
  LogoIcon,
  FooterMenu,
  FooterMenuItem,
  FooterMenuALink,
  LogoWrapper,
} from './styles'

export const BottomBar = React.memo(() => {
  return (
    <BottomBarWrapper>
      <Container>
        <FooterWrapper>
          <LogoWrapper to="/feed">
            <LogoIcon src={LogoIconImage} />
          </LogoWrapper>
          <FooterMenu>
            <FooterMenuItem>
              <FooterMenuALink href="https://about.peacenik.app">ABOUT Peacenik</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuALink href="https://about.peacenik.app/end-user-license-agreement">EULA</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuALink href="https://about.peacenik.app/code-of-conduct">Code of Conduct</FooterMenuALink>
            </FooterMenuItem>
          </FooterMenu>
        </FooterWrapper>
      </Container>
      <CopyrightWrapper>Koto LLC © Copyright 2021 | All Rights Reserved</CopyrightWrapper>
    </BottomBarWrapper>
  )
})