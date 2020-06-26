import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Footer = () => (
  <Menu>
    <LinkStyled to="/forgotten-password">Forgotten password</LinkStyled>
    <LinkStyled to="/register">Register for Koto</LinkStyled>
    <LinkStyled to="/about">About Koto</LinkStyled>
    <LinkStyled to="/code-of-conduct">Code of conduct</LinkStyled>
    <LinkStyled to="/contact-us">Contact us</LinkStyled>
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