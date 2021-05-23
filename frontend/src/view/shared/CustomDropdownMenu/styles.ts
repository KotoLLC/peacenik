import styled from 'styled-components'

export const DropdownMenuWrapper = styled.div`
  position: relative;
`

export const Dropdown = styled.div`
  position: absolute;
  z-index: 2500;
  width: 180px;
  right: -5px; 
  top: 43px;
  background: #FFFFFF;
  box-shadow: 0px 1px 8px #D4D4D4;
  border-radius: 0px;

  &:after {
    position: absolute;
    content: '';
    top: -5px;
    right: 30px;
    transform: rotate(45deg);
    z-index: 10;
    width: 10px;
    height: 10px;
    background: #FFFFFF;
    box-shadow: 0px 1px 8px #D4D4D4;
  }
  &:before {
    position: absolute;
    content: '';
    top: 0px;
    right: 15px;
    z-index: 99;
    width: 40px;
    height: 15px;
    background: #fff;
  }
  li:nth-child(n+2) {
    &:before {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 1px;
      background: #979797;
      opacity: 0.6;
      content: '';
    }
  }
  
`

export const CustomMenuItem = styled.li`
  min-width: 180px;
  color: #262626;
  padding: 10px 20px;
  list-style: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.15s;

  svg {
    transition: 0.15s;
  }

  &.logout {
    position: relative;

    svg {
      color: #A1AEC8;
    }

    &:before {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 1px;
      background: #979797;
      opacity: 0.6;
      content: '';
    }
  }

  &:hover {
    color: #8f8f90;

    svg {
      color: #8f8f90;
    }
  }
`