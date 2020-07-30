import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

export const BuleetsWrapper = styled.div`
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
`

export const Bullet = styled.span`
  display: block;
  margin: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  background: #d4d4d4;

  &.active {
    background: #9c9c9c;
  }
`

export const ContainerStyled = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  min-height: 100vh;
`

export const GoBackButton = styled(Button)`
  &&{
    position: absolute;
    bottom: 40px;
    left: 40px;
  }
`