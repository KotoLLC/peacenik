import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

export const DocWrapper = styled.div`
  margin: 20px 0 30px;
  width: 100%;
`

export const PaperStyled = styled(Paper)`
  && {
    position: relative;
    padding: 40px 40px 100px;
    min-height: calc(100vh - 40px);
  }
`

export const GoBackButton = styled(Button)`
  &&{
    position: absolute;
    bottom: 40px;
    left: 40px;
  }
`