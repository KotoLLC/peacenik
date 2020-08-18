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
import {
  ContainerStyled,
  EmptyMessage,
  UpButton,
  PreloaderWrapper,
  BoldText,
} from './styles'

interface Props extends RouteComponentProps {
  messageTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
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
}

class MessageFeed extends React.Component<Props, State> {

  state = {
    authToken: '',
  }

  timerId

  editorRef = React.createRef<HTMLDivElement>()

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
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    )

    if (scrollHeight === window.innerHeight + window.pageYOffset) {
      this.props.onGetMoreMessages()
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
      }, 10000)
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
    return sortedData.map(item => <Message
      {...item}
      key={item.id}
      isAuthor={(userId === item.user_id) ? true : false} />
    )
  }
 
  onScrollUp = () => {
    this.editorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  checkCurrentHub = () => {
    const { currentHub, messages, isAboutUsViewed, history } = this.props

    if (currentHub.host) {
      return (
        <>
          <div ref={this.editorRef}><Editor /></div>
          {this.mapMessages(messages)}
        </>
      )
    }

    if (isAboutUsViewed) {
      return (
        <EmptyMessage>
          For start the communicating, you should create a <BoldText onClick={() => history.push('/hubs/create')}>message hub</BoldText>.
        </EmptyMessage>
      )
    }

    return (
      <EmptyMessage>
        <PreloaderWrapper>
          <CircularProgress/>
        </PreloaderWrapper>
      </EmptyMessage>
    )
  }

  componentDidUpdate() {
    const { isMessagesRequested, messageTokens, isAboutUsViewed } = this.props
    if (isAboutUsViewed) return false

    if (isMessagesRequested === false && !messageTokens.length) {
      this.props.history.push('/about-us')
    }
  }

  render() {
    const { isMoreMessagesRequested } = this.props

    return (
      <ContainerStyled maxWidth="md">
        {this.checkCurrentHub()}
        {isMoreMessagesRequested && <PreloaderWrapper className="bottom"><CircularProgress/></PreloaderWrapper>}
        <UpButton color="inherit" onClick={this.onScrollUp}>
          <ArrowUpwardIcon />
        </UpButton>
      </ContainerStyled>
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
})

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentHub' | 'onGetMoreMessages'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentHub: () => dispatch(Actions.messages.getCurrentHubRequest()),
  onGetMoreMessages: () => dispatch(Actions.messages.getMoreMessagesRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageFeed)