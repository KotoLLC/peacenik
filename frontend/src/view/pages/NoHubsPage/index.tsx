import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { WithTopBar } from '@view/shared/WithTopBar'
import { ContainerStyled, ButtonStyled } from './styles'
import ReactMarkdown from 'react-markdown'
import nothingPicture from './../../../assets/images/nothing.jpg'
import selectors from '@selectors/index'
import { StoreTypes, CommonTypes } from 'src/types'

interface Props extends RouteComponentProps {
  messageTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub

  onSetAboutUsViewed: () => void
}

export const NoHubs: React.FC<Props> = (props) => {
  const { messageTokens, currentHub } = props

  const onGoToInvites = () => {
    props.history.push('/friends/invitations')
    props.onSetAboutUsViewed()
  } 

  useEffect(()=>{
    if (messageTokens?.length || currentHub?.token) {
      props.history.push('/messages')
    }
  }, [
    messageTokens,
    currentHub,
  ])

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

type StateProps = Pick<Props,
  | 'messageTokens'
  | 'currentHub'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageTokens: selectors.messages.messageTokens(state),
  currentHub: selectors.messages.currentHub(state),
})

type DispatchProps = Pick<Props, 'onSetAboutUsViewed'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onSetAboutUsViewed: () => dispath(Actions.common.setAboutUsViewed())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NoHubs))
