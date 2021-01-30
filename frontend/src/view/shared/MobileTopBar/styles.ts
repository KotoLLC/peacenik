import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'

export const MobileTopBarWrapper = styled.header`
  display: none;
  background: #FFFFFF;
  box-shadow: 0px 1px 5px #D4D4D4;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 47px;
  padding: 0 10px 0 15px;

  @media (max-width: 760px){
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const Logo = styled.img`
  position: relative;
  top: 0px;
  left: -5px;
  display: block;
  max-height: 34px;
`

export const NavigationsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export const MenuItem = styled.span`
  padding: 0 10px;
  display: inline-block;
  position: relative;
`

export const MenuLink = styled(NavLink)`
  display: inline-block;
  color: #C9CFD4;
  transition: 0.15s;
  position: relative;
  height: 47px;
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

export const HamburgerButton = styled.span`
  display: inline-flex;
  padding: 10px;
  cursor: pointer;
`

export const HamburgerMenu = styled.nav`
  padding-left: 15px;
  position: absolute;
  left: 0;
  top: 47px;
  width: 100%;
  background: #fff;
`

export const HamburgerMenuItem = styled.div`
  list-style: none;
  border-bottom: 1px solid rgba(200, 207, 212, 0.6);
  position: relative;

  &:after {
    content: '';
    display: inline-block;
    height: 1px;
    width: calc(100% - 15px);
    position: absolute;
    bottom: 0;
    right: 0;
  }

  &:last-child {
    border: none;

    &:after {
      display: none;
    }
  }
`

export const HamburgerMenuLink = styled(NavLink)`
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  color: #A1AEC8;

  .groug-icon {
    transition: 0.15s;
    fill: #C8CFD4;
  }

  .icon {
    margin-right: 15px;
  }

  &.active {
    color: #262626;

    .icon {
      color: #262626;     
    }

    .groug-icon {
      fill: #262626;
    }
  }
`