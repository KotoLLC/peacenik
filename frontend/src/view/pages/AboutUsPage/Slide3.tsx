import React from 'react'
import { ContainerStyled } from './styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

interface Props {
  onGoToMessageHubs: () => void
}

export const Slide3: React.FC<Props> = (props) => {

  return (
    <ContainerStyled maxWidth="md">
      <div>
        <Typography variant="h3" gutterBottom>Create message hub</Typography>
        <Button variant="contained" color="primary" onClick={props.onGoToMessageHubs}>create message hub</Button>
      </div>
    </ContainerStyled>
  )
}