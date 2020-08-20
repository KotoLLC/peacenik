
import React from 'react'
import Message from '@view/pages/MessagesPage/Message'
import { ApiTypes, StoreTypes } from 'src/types'
import { EmptyMessage, PreloaderWrapper } from '@view/pages/MessagesPage/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { ButtonsWrapper, ContainerStyled } from './styles'
import { RouteComponentProps } from 'react-router-dom'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import queryString from 'query-string'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { connect } from 'react-redux'

interface Props extends RouteComponentProps {
  messageById: ApiTypes.Messages.Message | null | undefined
  onGetMessageById: (id: string) => void
  onResetMessageById: () => void
}

interface State {
  isCommentsOpen: boolean
}

class NotificationsInfo extends React.PureComponent<Props, State> {

  state = {
    isCommentsOpen: false,
  }

  getMessage = () => {
    const { onGetMessageById, history } = this.props
    const parsed = queryString.parse(history.location.search)

    if (parsed?.type?.indexOf('comment') !== -1) {
      this.setState({
        isCommentsOpen: true,
      })
    }

    if (parsed?.message_id) {
      onGetMessageById(parsed.message_id as string)
    }
  }

  componentDidMount() {
    this.getMessage()
  }

  componentWillUnmount() {
    this.props.onResetMessageById()
  }

  render() {
    const { messageById, history } = this.props
    const { isCommentsOpen } = this.state

    if (messageById === null) {
      return (
        <EmptyMessage>
          <PreloaderWrapper>
            <CircularProgress />
          </PreloaderWrapper>
        </EmptyMessage>
      )
    }

    if (messageById === undefined) {
      return (
        <>
        <EmptyMessage>
          404 message not found
        </EmptyMessage>
        <ButtonsWrapper>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
            >back</Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => history.push('/messages')}
            >Messages</Button>
          </ButtonsWrapper>
        </>
      )
    } else {
      return (
        <ContainerStyled maxWidth="md">
          <Message {...messageById} isAuthor={false} isCommentsOpenByDeafult={isCommentsOpen} callback={this.getMessage} />
          <ButtonsWrapper>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
            >back</Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => history.push('/messages')}
            >Messages</Button>
          </ButtonsWrapper>
        </ContainerStyled>
      )
    }
  }
}

type StateProps = Pick<Props, 'messageById'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageById: selectors.messages.messageById(state),
})

type DispatchProps = Pick<Props, 'onGetMessageById' | 'onResetMessageById'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onGetMessageById: (id: string) => dispath(Actions.messages.getMessagesByIdRequest(id)),
  onResetMessageById: () => dispath(Actions.messages.resetMessageById()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsInfo)