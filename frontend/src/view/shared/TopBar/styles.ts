import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import Toolbar from '@material-ui/core/Toolbar'

export const AppBarStyled = styled(AppBar)`
  background: #fff;
  box-shadow: 0px 1px 5px #D4D4D4;
  
  @media (max-width: 770px){
    display: none;
  }
`

export const LogoMobile = styled.img`
  display: none;

  @media (max-width: 770px){
    position: relative;
    top: 0px;
    left: -5px;
    display: block;
    max-height: 40px;
  }
`

export const Logo = styled.img`
  max-width: 142px;
  position: relative;
  top: 3px;

  @media (max-width: 770px){
    display: none;
  }
`

export const NavigationsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export const MenuItem = styled.span`
  padding: 0 30px;
  display: inline-block;
  /* position: relative; */

  &:after {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 22px;
    width: 1px;
    height: 20px;
    background: #C8CFD4;
    opacity: 0.6;
    content: '';
  }

  &:nth-child(6) {

    &:after {
      display: none;
    }

  }
`

export const MenuLink = styled(NavLink)`
  display: inline-block;
  color: #C9CFD4;
  transition: 0.15s;
  position: relative;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 24px;
    height: 4px;
    border-radius: 100px;
    background: transparent;
    transition: 0.15s;
    content: '';
  }

  .groug-icon {
    transition: 0.15s;
    fill: #C8CFD4;
  }

  &.active {
    color: #262626;

    .groug-icon {
      fill: #262626;
    }

    &:after {
      background: #599C0B;
    }
  }

  &:hover {
    color: #262626;

    .groug-icon {
      fill: #262626;
    }
    
    &:after {
      background: #599C0B;
    }
  }

  
`

export const BadgeStyled = styled(Badge)`
  
  .MuiBadge-badge {
    background-color: #F22229;
    border: 1px solid #fff;
  }
`

export const ToolbarStyled = styled(Toolbar)`
  && {
    padding: 0;
  }
`