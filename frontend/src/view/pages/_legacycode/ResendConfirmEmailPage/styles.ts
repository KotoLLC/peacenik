import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

export const PageWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
`

export const PaperStyled = styled(Paper)`
  && {
    position: relative;
    padding: 40px 40px;
    min-height: calc(30vh);
    width: 100%;
    max-width: 650px;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`

export const ButtonStyled = styled(Button)`
  &&{
    margin: 10px
  }
`

export const LogoutWrapper = styled.div`
  position: fixed;
  right: 10px;
  top: 10px;
`