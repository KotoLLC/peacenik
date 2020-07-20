import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

export const ContainerStyled = styled(Container)`
  && {
    margin-top: 75px;
  }
`

export const NotificationsWrapper = styled(Paper)`
  padding: 15px;
  min-height: 50vh;
  position: relative;
  padding-bottom: 80px;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
` 

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 15px;
  left: 0px;
  padding: 0 15px;
` 

export const Title = styled.h3`
  font-size: 18px;
  margin: 0;
`

export const ListWrapper = styled.div`
  margin-top: 10px;
`

export const ListIten = styled.div`
  margin-bottom: 10px;
  display: flex;
`

export const ListDate = styled.span`
  width: 20%;
`

export const ListText = styled.p`
  width: 80%;
  margin: 0;
  display: flex;
  align-items: center;
`

export const ListLink = styled.span`
  margin-left: 7px;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`