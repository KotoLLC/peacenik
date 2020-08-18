import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled } from './styles'
import ReactMarkdown from 'react-markdown'
import Button from '@material-ui/core/Button'
import milhousePicture from './../../../assets/images/milhouse.gif'
import waitPicture from './../../../assets/images/oneMore.gif'
import dothisPicture from './../../../assets/images/dothis.gif'

interface Props extends RouteComponentProps {
  onSetAboutUsViewed: () => void
}

export const AboutUsSlider: React.SFC<Props> = (props) => {

  const onGoToHubs = () => {
    props.history.push('/hubs/create')
    props.onSetAboutUsViewed()
    localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  const onGoToInvites = () => {
    props.history.push('/friends/invitations')
    props.onSetAboutUsViewed()
    localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  return (
    <WithTopBar>
      <ContainerStyled maxWidth="md">
        <ReactMarkdown>{`
  # Welcome to Koto
  Like most social networks, koto starts with friends. And from the look of it, you don't have any.
  
  ![](${milhousePicture})

  # Making friends
  Making friends is easy.
  Just go to the friends page and press the add friends button.
  `}
        </ReactMarkdown>
        <Button
          variant="contained"
          color="primary"
          onClick={onGoToInvites}>
          Invite a friend
          </Button>
        <ReactMarkdown>{`
  Oh. Wait. There's one more thing
  
  ![](${waitPicture})

  # Message hubs
  So. One last thing.

  One of your friends needs to run a message hub. Or, if you know about software, you can run it for them. Without a message hub, they can't post messages.

  ![](${dothisPicture})
  `}
        </ReactMarkdown>
        <Button
          variant="contained"
          color="primary"
          onClick={onGoToHubs}>
          Create a message hub
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