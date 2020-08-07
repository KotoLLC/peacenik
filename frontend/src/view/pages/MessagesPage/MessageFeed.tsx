import React from 'react'
import Editor from './Editor'
import Message from './Message'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { Link } from 'react-router-dom'
import { StoreTypes, ApiTypes, CommonTypes } from 'src/types'
import Button from '@material-ui/core/Button'
import {
  ContainerStyled,
  EmptyMessage,
  UpButton,
} from './styles'
import { sortByDate } from '@services/sortByDate'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

interface Props {
  messageTokens: CommonTypes.NodeTypes.CurrentNode[]
  currentNode: CommonTypes.NodeTypes.CurrentNode
  messages: ApiTypes.Messages.Message[]
  userId: string
  authToken: string
  onGetMessages: () => void
  onGetCurrentNode: () => void
  onGetMessagesFromNode: (data: ApiTypes.Messages.MessagesFromNode) => void
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
    return (
      <ContainerStyled maxWidth="md">
        {this.checkCurrentNode()}
        <UpButton color="inherit" onClick={this.onScrollUp}>
          <ArrowUpwardIcon />
        </UpButton>
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'messageTokens' | 'currentNode' | 'messages' | 'userId' | 'authToken'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageTokens: selectors.messages.messageTokens(state),
  currentNode: selectors.messages.currentNode(state),
  messages: selectors.messages.messages(state),
  userId: selectors.profile.userId(state),
  authToken: selectors.authorization.authToken(state),
})

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentNode' | 'onGetMessagesFromNode'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentNode: () => dispatch(Actions.messages.getCurrentNodeRequest()),
  onGetMessagesFromNode: (data: ApiTypes.Messages.MessagesFromNode) => dispatch(Actions.messages.getMessagesFromNodeRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageFeed)