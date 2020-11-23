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

  ![](${nothingPicture})

  ## Message hubs

  Message hubs store messages, photos, and videos. Without a hub, you can't
  post a message.

  Your group of friends only needs one hub. You need to either create a hub on your own, or find a friend who has one. 
  You need to know their email address ahead of time.

  `}
        </ReactMarkdown>
          <Button rel="noopener" variant="contained" target="_blank" href="https://docs.koto.at/#/install-message-hub" color="primary">
          Learn how to create a hub
           </Button>
            or 
          <Button
          variant="contained"
          color="primary"
          onClick={onGoToInvites}>
          Email an invite to a friend who has a one
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
