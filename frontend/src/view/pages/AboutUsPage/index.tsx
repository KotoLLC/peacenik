import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled, ButtonStyled } from './styles'
import ReactMarkdown from 'react-markdown'
import nothingPicture from './../../../assets/images/nothing.jpg'

interface Props extends RouteComponentProps {
  onSetAboutUsViewed: () => void
}

export const AboutUsSlider: React.SFC<Props> = (props) => {

  // const onGoToHubs = () => {
  //   props.history.push('/hubs/create')
  //   props.onSetAboutUsViewed()
  //   // localStorage.setItem('kotoIsAboutUsViewed', 'true')
  // }

  const onGoToInvites = () => {
    props.history.push('/friends/invitations')
    props.onSetAboutUsViewed()
    // localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  return (
    <WithTopBar>
      <ContainerStyled maxWidth="md">
        <ReactMarkdown>{`

  ![](${nothingPicture})

  ## Message hubs

  Message hubs store messages, photos, and videos. Without a hub, you can't
  post a message.

  Your group of friends only needs one hub. You need to either create a hub on your own, or find a friend who has one. 
  You need to know their email address ahead of time.

  `}
        </ReactMarkdown>
        <a rel="noopener noreferrer" target="_blank" href="https://docs.koto.at/#/install-message-hub" >
          <ButtonStyled variant="contained" color="primary">Set up a hub (technical!)</ButtonStyled>
        </a>
        <ButtonStyled
          variant="contained"
          color="primary"
          onClick={onGoToInvites}>
          Find a friend that has a hub
        </ButtonStyled>
      </ContainerStyled>
    </WithTopBar>
  )
}

type DispatchProps = Pick<Props, 'onSetAboutUsViewed'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onSetAboutUsViewed: () => dispath(Actions.common.setAboutUsViewed())
})

export default connect(null, mapDispatchToProps)(withRouter(AboutUsSlider))
