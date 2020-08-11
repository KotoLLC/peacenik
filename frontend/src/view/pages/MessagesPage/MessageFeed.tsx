import React from 'react'
import Editor from './Editor'
import Message from './Message'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { Link } from 'react-router-dom'
import { StoreTypes, ApiTypes, CommonTypes } from 'src/types'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  ContainerStyled,
  EmptyMessage,
  UpButton,
  PreloaderWrapper,
} from './styles'
import { sortByDate } from '@services/sortByDate'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

interface Props {
  messageTokens: CommonTypes.NodeTypes.CurrentNode[]
  currentNode: CommonTypes.NodeTypes.CurrentNode
  messages: ApiTypes.Messages.Message[]
  userId: string
  authToken: string
  isMoreMessageRequested: boolean
  onGetMessages: () => void
  onGetMoreMessages: () => void
  onGetCurrentNode: () => void
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
    const { onGetMessages, onGetCurrentNode, authToken } = this.props

    if (authToken) {
      onGetMessages()
      onGetCurrentNode()

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
      newProps.onGetCurrentNode()
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

  checkCurrentNode = () => {
    const { currentNode, messages } = this.props

    if (currentNode.host) {
      return (
        <>
          <div ref={this.editorRef}><Editor /></div>
          {this.mapMessages(messages)}
        </>
      )
    } else {
      return (
        <EmptyMessage>
          <Link to="/about-us">
            <Button variant="outlined" >View our presentation</Button>
          </Link>
        </EmptyMessage>
      )
    }
  }

  render() {
    const { isMoreMessageRequested } = this.props
    return (
      <ContainerStyled maxWidth="md">
        {this.checkCurrentNode()}
        {isMoreMessageRequested && <PreloaderWrapper><CircularProgress/></PreloaderWrapper>}
        <UpButton color="inherit" onClick={this.onScrollUp}>
          <ArrowUpwardIcon />
        </UpButton>
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'messageTokens' | 'currentNode' | 'messages' | 'userId' | 'authToken' | 'isMoreMessageRequested'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageTokens: selectors.messages.messageTokens(state),
  currentNode: selectors.messages.currentNode(state),
  messages: selectors.messages.messages(state),
  userId: selectors.profile.userId(state),
  authToken: selectors.authorization.authToken(state),
  isMoreMessageRequested: selectors.messages.isMoreMessageRequested(state),
})

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentNode' | 'onGetMoreMessages'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentNode: () => dispatch(Actions.messages.getCurrentNodeRequest()),
  onGetMoreMessages: () => dispatch(Actions.messages.getMoreMessagesRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageFeed)