import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextareaAutosize from 'react-autosize-textarea'
import Button from '@material-ui/core/Button'

export const ContainerStyled = styled(Container)`
  && {
    padding-top: 100px;
  }
`

export const PaperStyled = styled(Paper)`
  && {
    padding: 20px 20px;
  }
`

export const CreateWrapper = styled.div`
  display: flex;
`

export const EditorWrapper = styled.div`
  width: calc(100% - 60px);
  margin-left: 20px;
`

export const TextareaAutosizeStyled = styled(TextareaAutosize)`
  outline: none;
  resize:none;
  border: none;
  border-bottom: 1px solid #000;
  width: 100%;
  min-height: 40px;
  font-family: 'Arial';
  font-size: 16px;
  margin-top: 5px;
  margin-bottom: 5px;
`

export const ButtonSend = styled(Button)`
  && {
    float: right;
  }
`

export const TextareaTitle = styled.p`
  font-size: 14px;
  margin-top: -5px;
  color: grey;
  transition: 0.3s;
  opacity: 1;

  &.active {
    opacity: 0;
  }
`