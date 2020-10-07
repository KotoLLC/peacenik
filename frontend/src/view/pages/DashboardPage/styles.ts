import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

export const ContainerStyled = styled(Container)`
  && {
    margin-top: 75px;
  }
`

export const DashboardSection = styled(Paper)`
  padding: 15px;
  position: relative;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
` 

export const Title = styled.h3`
  font-size: 18px;
  margin: 0 0 30px;
`

export const ContentWrapper = styled.div`
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;

  &:after {
    display: block;
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ccc;
  }

  &.unresolved {
    background: rgba(255, 243, 207, 1)
  }

  &:last-child{
    margin-bottom: 0px;

    &:after {
      display: none;
    }
  }
`

export const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 10px;
`

export const ButtonStyled = styled(Button)`
  && {
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    && {
      margin-top: 10px;
    }
  }
`
export const ResolveButton = styled(Button)`
  && {
    background: #34c242;
    margin-left: 10px;

    &:hover {
      background: #32ab3d;
    }
  }

  @media (max-width: 600px) {
    && {
      margin-top: 10px;
    }
  }
`

export const ReportText = styled.p`
  font-weight: bold;

  span {
    font-weight: normal;
  }
`

export const ReportTitle = styled.h3`
  font-size: 1.2em;
  margin: 0 0 10px;
`

export const MessageContent = styled.div`
  font-family: Raleway, Arial;
  font-size: 14px;
  margin: 10px 0;
  padding: 0;
  white-space: pre-wrap;
`