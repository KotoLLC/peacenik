import React from 'react'
import Editor from './Editor'
import Message from './Message'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes, CommonTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import { sortByDate } from '@services/sortByDate'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import PullToRefresh from 'react-simple-pull-to-refresh'

import {
  ContainerStyled,
  EmptyMessageFeed,
  UpButton,
  PreloaderWrapper,
} from './styles'

interface Props extends RouteComponentProps {
  messageTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubReqyested: boolean
  messages: ApiTypes.Messages.Message[]
  userId: string
  authToken: string
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  isAboutUsViewed: boolean

  onGetMessages: () => void
  onGetMoreMessages: () => void
  onGetCurrentHub: () => void
}

interface State {
  authToken: string
  messageLenght: number
}

class MessageFeed extends React.Component<Props, State> {

  state = {
    authToken: '',
    messageLenght: 0,
  }

  timerId

  editorRef = React.createRef<HTMLDivElement>()
  lastMessageRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    const { onGetMessages, onGetCurrentHub, authToken } = this.props

    if (authToken) {
      onGetMessages()
      onGetCurrentHub()

      this.timerId = setInterval(() => {
        onGetMessages()
      }, 10000)
    }

    window.addEventListener('scroll', this.onScrollList)
  }

  onScrollList = () => {
    const { isMoreMessagesRequested, messages } = this.props
    const { messageLenght } = this.state
    const lastMessageRect = this.lastMessageRef?.current?.getBoundingClientRect()

    if (!lastMessageRect) return

    if (lastMessageRect?.top <= window.innerHeight && isMoreMessagesRequested !== true) {
      if (messages?.length !== messageLenght) {
        this.props.onGetMoreMessages()
        this.setState({
          messageLenght: messages.length
        })
      }
    }
  }

  static getDerivedStateFromProps(newProps: Props, prevState: State) {

    if (newProps.authToken !== prevState.authToken) {
      newProps.onGetMessages()
      newProps.onGetCurrentHub()
      return {
        authToken: newProps.authToken
      }
    }
    return null
  }

  shouldComponentUpdate(newProps: Props, newState: State) {
    if (this.props.authToken !== newState.authToken) {
      this.timerId = setInterval(() => {
        newProps.onGetMessages()
      }, 20000)
    }

    return true
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
    window.removeEventListener('scroll', this.onScrollList)
  }

  mapMessages = (messages: ApiTypes.Messages.Message[]) => {
    const { userId } = this.props
    const sortedData = sortByDate(messages)

    return sortedData.map((item, index) => {

      if (index === sortedData.length - 1) {
        return (
          <div ref={this.lastMessageRef} key={item.id}>
            <Message
              {...item}
              isAuthor={(userId === item.user_id) ? true : false} />
          </div>
        )
      }

      return <Message
        {...item}
        key={item.id}
        isAuthor={(userId === item.user_id) ? true : false} />
    })
  }

  onScrollUp = () => {
    this.editorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  onRefresh = () => {
    return new Promise((resolve, reject) => {

      this.props.onGetMessages()
      setTimeout(() => {
        resolve()
      }, 700)

    })
  }

  checkCurrentHub = () => {
    const { messages, isCurrentHubReqyested } = this.props

    if (isCurrentHubReqyested) {
      return (
        <EmptyMessageFeed>
          <PreloaderWrapper>
            <CircularProgress />
          </PreloaderWrapper>
        </EmptyMessageFeed>
      )
    } else {

      return (
        <>
          <div ref={this.editorRef}><Editor /></div>
          {this.mapMessages(messages)}
        </>
      )
    }
  }
 
  componentDidUpdate() {
    const { isMessagesRequested, messageTokens, isAboutUsViewed, currentHub } = this.props
    if (isAboutUsViewed) return false

    if (isMessagesRequested === false && !messageTokens.length && !currentHub?.token) {
      this.props.history.push('/no-hubs')
    }
  }

  render() {
    const { isMoreMessagesRequested } = this.props

    return (
      <PullToRefresh
        onRefresh={this.onRefresh}
        refreshingContent={<CircularProgress />}
      >
        <ContainerStyled maxWidth="md">
          {this.checkCurrentHub()}
          {isMoreMessagesRequested && <PreloaderWrapper className="bottom"><CircularProgress /></PreloaderWrapper>}
          <UpButton color="inherit" onClick={this.onScrollUp}>
            <ArrowUpwardIcon />
          </UpButton>
        </ContainerStyled>
      </PullToRefresh>
    )
  }
}

type StateProps = Pick<Props,
  | 'messageTokens'
  | 'currentHub'
  | 'messages'
  | 'userId'
  | 'authToken'
  | 'isMoreMessagesRequested'
  | 'isMessagesRequested'
  | 'isAboutUsViewed'
  | 'isCurrentHubReqyested'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageTokens: selectors.messages.messageTokens(state),
  currentHub: selectors.messages.currentHub(state),
  messages: selectors.messages.messages(state),
  userId: selectors.profile.userId(state),
  authToken: selectors.authorization.authToken(state),
  isMoreMessagesRequested: selectors.messages.isMoreMessagesRequested(state),
  isMessagesRequested: selectors.messages.isMessagesRequested(state),
  isAboutUsViewed: selectors.common.isAboutUsViewed(state),
  isCurrentHubReqyested: selectors.messages.isCurrentHubRequested(state),
})

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentHub' | 'onGetMoreMessages'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentHub: () => dispatch(Actions.messages.getCurrentHubRequest()),
  onGetMoreMessages: () => dispatch(Actions.messages.getMoreMessagesRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageFeed)