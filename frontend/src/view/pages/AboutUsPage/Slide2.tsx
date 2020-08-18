import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import waitPicture from './../../../assets/images/oneMore.gif'
import { ContainerStyled, ImageDemo } from './styles'
interface Props {
  onGoToInvites: () => void
}
export const Slide2: React.FC<Props> = (props) => {
  return (
    <ContainerStyled maxWidth="md">
      <div>
      <Typography variant="h3" gutterBottom>Making friends</Typography>
      <Typography variant="h5" gutterBottom>
      Making friends is easy.
      </Typography>
      <Typography variant="h5" gutterBottom>
      Just go to the friends page and press the add friends button.
      </Typography>
      <Button variant="contained" color="primary" onClick={props.onGoToInvites}>Invite a friend</Button>
      </div>
      <div>
      <Typography variant="h5" gutterBottom>
      Oh. Wait. There's one more thing. ➡️
      </Typography>
      <ImageDemo src={waitPicture} alt="wait there's more"/>
      </div>
    </ContainerStyled>
  )
}