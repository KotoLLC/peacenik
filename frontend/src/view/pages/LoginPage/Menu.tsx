import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import i18n from '@view/i18n'

export const Footer = () => (
  <Menu>
    <LinkStyled to="/forgotten-password">{i18n.login.menu.forgottenPassword}</LinkStyled>
    <LinkStyled to="/register">{i18n.login.menu.register}</LinkStyled>
    <LinkStyled to="/about">{i18n.login.menu.about}</LinkStyled>
    <LinkStyled to="/code-of-conduct">{i18n.login.menu.codeOfConduct}</LinkStyled>
    <LinkStyled to="/contact-us">{i18n.login.menu.contactUs}</LinkStyled>
  </Menu>
)

const LinkStyled = styled(Link)`
  color: #1976d2;
  font-size: 1rem;
  text-decoration: none;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`

const Menu = styled.footer`
  width: 70%;
  padding: 50px 0 30px;
  margin-left: 10%;
  columns: 150px 2;
`