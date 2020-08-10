import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

interface MenuItem {
  title: string
  to: string
  disabled?: boolean
}

interface Props {
  menuItems: MenuItem[]
}

export const FooterMenu: React.SFC<Props> = React.memo((props) => {
  const { menuItems } = props

  const renderItem = (item: MenuItem) => {
    if (item.disabled) {
      return <DisabledLink key={uuidv4()}>{item.title}</DisabledLink>
    } else {
      return <LinkStyled key={uuidv4()} to={item.to}>{item.title}</LinkStyled>
    }
  }

  if (!menuItems.length) return null
  return <Menu>{menuItems.map(item => renderItem(item))}</Menu>
})

const DisabledLink = styled.span`
  color: grey;
  font-size: 1rem;
  text-decoration: none;
  display: block;
  margin-bottom: 5px;

  &:hover {
    text-decoration: none;     
    cursor: inherit;
  }
`

const LinkStyled = styled(Link)`
  color: #1976d2;
  font-size: 1rem;
  margin-bottom: 5px;
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