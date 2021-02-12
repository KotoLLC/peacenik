import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'

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
export const PreloaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
`