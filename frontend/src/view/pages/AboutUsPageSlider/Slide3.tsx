import React from 'react'
import { ContainerStyled, ImageDemo } from './styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import dothisPicture from './../../../assets/images/dothis.gif'

interface Props {
  onGoToMessageHubs: () => void
}
export const Slide3: React.FC<Props> = (props) => {
return (
    <ContainerStyled maxWidth="md">
      <div>
        <Typography variant="h3" gutterBottom>Message hubs</Typography>
        <Typography variant="h5" gutterBottom>
        So. One last thing.
        </Typography>
        <Typography variant="h5" gutterBottom>
        One of your friends needs to run a message hub. Or, if you know about software,
         you can run it for them. Without a message hub, they can't post messages.
        </Typography>
        <ImageDemo src={dothisPicture} alt="do this" />
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={props.onGoToMessageHubs}>Create a message hub</Button>
      </div>
    </ContainerStyled>
  )
}