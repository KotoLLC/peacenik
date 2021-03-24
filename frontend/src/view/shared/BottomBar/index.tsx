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
              <FooterMenuALink href="https://about.peacenik.app/contact-us">CONTACT US</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuALink href="https://about.peacenik.app">ABOUT Peacenik</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuALink href="https://about.peacenik.app/code-of-conduct">TERMS OF USE</FooterMenuALink>
            </FooterMenuItem>
          </FooterMenu>
        </FooterWrapper>
      </Container>
      <CopyrightWrapper>Koto LLC © Copyright 2021 | All Rights Reserved</CopyrightWrapper>
    </BottomBarWrapper>
  )
})