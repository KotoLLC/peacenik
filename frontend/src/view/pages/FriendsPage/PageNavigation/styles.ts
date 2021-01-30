import styled from 'styled-components'
// import Link from '@material-ui/core/Link';
import { NavLink } from 'react-router-dom'

export const NavigationWrapper = styled.nav`
  width: 360px;
  height: 54px;
  margin: 90px auto 38px;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;
  border-radius: 27px;
  display: flex;
  align-items: center;

  @media (max-width: 760px) {
    width: 300px;
    height: 44px;
    margin: 65px auto 20px;
  }
`

export const NavigationItem = styled(NavLink)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
  text-transform: uppercase;
  font-family: SFUITextMedium;
  transition: all 0.2s;
  color: #88909D;

  &.active {
    color: #262626;
    font-family: SFUITextBold;
  }

  &.active::before {
    content: '';
    position: absolute;
    bottom: 0;
    background: #599C0B;
    border-radius: 100px;
    width: 44px;
    height: 4px;
  }

  @media (max-width: 760px) {
    &.active::before {
      height: 2px;
    }
  }
`
