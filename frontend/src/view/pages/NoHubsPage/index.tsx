import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ContainerStyled, ButtonStyled } from './styles'
import ReactMarkdown from 'react-markdown'
import firstPicture from './../../../assets/images/1.nohub.png'
import secondPicture from './../../../assets/images/2.yourfriend.png'
import thirdPicture from './../../../assets/images/3.yourhub.png'
import fourthPicture from './../../../assets/images/4.manual.png'
import fifthPicture from './../../../assets/images/5.sponsored.png'
import selectors from '@selectors/index'
import { StoreTypes, CommonTypes } from 'src/types'
const ColoredLine = ({ color }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 1
      }}
  />
)

interface Props extends RouteComponentProps {
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub

  onSetAboutUsViewed: () => void
}

export const NoHubs: React.FC<Props> = (props) => {
  const { feedsTokens, currentHub } = props

  const onGoToInvites = () => {
    props.history.push('/friends/invite')
    props.onSetAboutUsViewed()
  } 

  useEffect(() => {
    if (feedsTokens?.length || currentHub?.token) {
      props.history.push('/feed')
    }
  }, [
    feedsTokens,
    currentHub,
    props.history
  ])

  return (
    <>
      <ContainerStyled maxWidth="md">
        <ReactMarkdown>{`

# Welcome to Peacenik!

## Good news. 

You joined. You're awesome.

## Bad news. 

You need a message hub to post and share messages.

![](${firstPicture})

## Getting a hub

### Option A: find a friend

The easiest way to get a hub is to be friends with someone who has one. Just go to the friends page, click the invite link, and send an invitation. If they accept - you can post and share on their hub.

![](${secondPicture})

`}
        </ReactMarkdown>
        <ButtonStyled
          variant="contained"
          color="primary"
          onClick={onGoToInvites}>
          Visit the friends page
        </ButtonStyled>
        
<ColoredLine color="#5595ff" />

<ReactMarkdown>{`

### Option B: create a hub

Another way is to create your own hub.

![](${thirdPicture})

### Sponsored hubs

If you want someone from the Peacenik team to create and sponsor your hub, send an email to **admin@koto.at** and we'll get to work. This is the easiest way to get started. For now we're offering this for free but that will inevitably change. Hosting is expensive!

![](${fifthPicture})

### Host it yourself

You can host your own hub on Amazon, Google, Digital Ocean, etc. Of course, this requires some technical skills on your part. Visit the Peacenik documentation to learn how it works.

![](${fourthPicture})

`}
</ReactMarkdown>

<a rel="noopener noreferrer" target="_blank" href="https://docs.koto.at/#/install-message-hub" >
  <ButtonStyled variant="contained" color="primary">Host a hub</ButtonStyled>
</a>
        
  </ContainerStyled>
</>
  )
}

type StateProps = Pick<Props,
  | 'feedsTokens'
  | 'currentHub'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  feedsTokens: selectors.feed.feedsTokens(state),
  currentHub: selectors.feed.currentHub(state),
})

type DispatchProps = Pick<Props, 'onSetAboutUsViewed'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onSetAboutUsViewed: () => dispath(Actions.common.setAboutUsViewed())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NoHubs))
