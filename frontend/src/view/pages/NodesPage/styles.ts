import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'

export const ContainerStyled = styled(Container)`
  && {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    min-height: calc(100vh - 70px);
  }
`

export const FormWrapper = styled.form`
  width: 380px;
  margin: 0 auto;
`

export const FormControlStyled = styled(FormControl)`
  && {
    margin: 0 0 15px; 
    width: 100%;
  }
`

export const ButtonStyled = styled(Button)`
  && {
    height: 42px;
    min-width: 200px;
  }
`

export const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`