import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Footer = () => (
  <Menu>
    <LinkStyled className="disabled" to="/login">Forgotten password</LinkStyled>
    <LinkStyled className="disabled" to="/login">Register for Koto</LinkStyled>
    <LinkStyled className="disabled" to="/login">About Koto</LinkStyled>
    <LinkStyled to="/docs/code-of-conduct">Code of conduct</LinkStyled>
    <LinkStyled className="disabled" to="/login">Contact us</LinkStyled>
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

  &.disabled {
    color: grey;

    &:hover {
      text-decoration: none;     
      cursor: inherit;
    }
  }
`

const Menu = styled.footer`
  width: 70%;
  padding: 50px 0 30px;
  margin-left: 10%;
  columns: 150px 2;
`