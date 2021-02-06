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
  FooterMenuLink,
  FooterMenuALink,
  LogoWrapper,
} from './styles'

export const BottomBar = React.memo(() => {
  return (
    <BottomBarWrapper>
      <Container>
        <FooterWrapper>
          <LogoWrapper to="/messages">
            <LogoIcon src={LogoIconImage} />
          </LogoWrapper>
          <FooterMenu>
            <FooterMenuItem>
              <FooterMenuALink href="https://docs.koto.at/#/help">CONTACT US</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuALink href="https://docs.koto.at">ABOUT Peacenik</FooterMenuALink>
            </FooterMenuItem>
            <FooterMenuItem>
              <FooterMenuLink to="/docs/code-of-conduct">TERMS OF USE</FooterMenuLink>
            </FooterMenuItem>
          </FooterMenu>
        </FooterWrapper>
      </Container>
      <CopyrightWrapper>Koto LLC © Copyright 2021 | All Rights Reserved</CopyrightWrapper>
    </BottomBarWrapper>
  )
})