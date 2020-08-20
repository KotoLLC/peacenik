import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled } from './styles'
import ReactMarkdown from 'react-markdown'
import Button from '@material-ui/core/Button'
import nothingPicture from './../../../assets/images/nothing.jpg'

interface Props extends RouteComponentProps {
  onSetAboutUsViewed: () => void
}

export const AboutUsSlider: React.SFC<Props> = (props) => {

  const onGoToHubs = () => {
    props.history.push('/hubs/create')
    props.onSetAboutUsViewed()
    // localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  const onGoToInvites = () => {
    props.history.push('/friends/invitations')
    props.onSetAboutUsViewed()
    // localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  return (
    <WithTopBar>
      <ContainerStyled maxWidth="md">
        <ReactMarkdown>{`
  # Getting started
  
  ![](${nothingPicture})

  ##  Making friends

  Making friends is easy. Just visit the friends page and invite someone.

  ## Message hubs

  Message hubs store messages, photos, and videos. Without a hub, you can't
  post a message.

  Every group of friends needs a hub. One person becomes a hub runner, and everyone
  else uses that person's hub.

  ## Summer / Fall 2020

  As we're just getting started, everyone can use my hub, by sending an invite
  to mreider@gmail.com. Or, if you'd like toexperiment, feel free to start your own.

  `}
        </ReactMarkdown>
        <Button
          variant="contained"
          color="primary"
          onClick={onGoToInvites}>
          Invite friends
          </Button> <Button
          variant="contained"
          color="primary"
          onClick={onGoToHubs}>
          Create a hub
          </Button>
      </ContainerStyled>
    </WithTopBar>
  )
}

type DispatchProps = Pick<Props, 'onSetAboutUsViewed'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onSetAboutUsViewed: () => dispath(Actions.common.setAboutUsViewed())
})

export default connect(null, mapDispatchToProps)(withRouter(AboutUsSlider))