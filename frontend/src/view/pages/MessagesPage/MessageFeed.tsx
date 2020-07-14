import React from 'react'
import { ContainerStyled, EmptyMessage } from './styles'
import Editor from './Editor'
import { Message } from './Message'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes, NodeTypes } from './../../../types'
import { Link } from 'react-router-dom'
import { sortByDate } from '@services/sortByDate'

interface Props {
  messageTokens: NodeTypes.CurrentNode[]
  currentNode: NodeTypes.CurrentNode
  messages: ApiTypes.Messages.Message[]
  userId: string
  onGetMessages: () => void
  onGetCurrentNode: () => void
  onGetMessagesFromNode: (data: ApiTypes.Messages.MessagesFromNode) => void
}

class MessageFeed extends React.Component<Props> {

  componentDidUpdate(prevProps: Props) {
    const { messageTokens, onGetMessagesFromNode } = this.props

    if (messageTokens?.length !== prevProps.messageTokens?.length) {
      messageTokens.forEach((item) => {
        onGetMessagesFromNode({
          host: item.host,
          body: {
            token: item.token,
          }
        })
      })
    }
  }

  componentDidMount() {
    const { onGetMessages, onGetCurrentNode } = this.props
    onGetMessages()
    onGetCurrentNode()
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

  render() {
    const { currentNode, messages } = this.props

    return (
      <ContainerStyled maxWidth="md">
        {this.mapMessages(messages)}
        {(currentNode.host)
          ? <Editor />
          : <EmptyMessage>To send messages you need to <Link to="/nodes/create">register the node</Link></EmptyMessage>}
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'messageTokens' | 'currentNode' | 'messages' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageTokens: selectors.messages.messageTokens(state),
  currentNode: selectors.messages.currentNode(state),
  messages: selectors.messages.messages(state),
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentNode' | 'onGetMessagesFromNode'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentNode: () => dispatch(Actions.messages.getCurrentNodeRequest()),
  onGetMessagesFromNode: (data: ApiTypes.Messages.MessagesFromNode) => dispatch(Actions.messages.getMessagesFromNodeRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageFeed)