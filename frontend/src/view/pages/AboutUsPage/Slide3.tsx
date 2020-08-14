import React from 'react'
import { ContainerStyled } from './styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

interface Props {
  onGoToNodes: () => void
}

export const Slide3: React.FC<Props> = (props) => {

  return (
    <ContainerStyled maxWidth="md">
      <div>
        <Typography variant="h3" gutterBottom>Create node</Typography>
        <Button variant="contained" color="primary" onClick={props.onGoToNodes}>create node</Button>
      </div>
    </ContainerStyled>
  )
}