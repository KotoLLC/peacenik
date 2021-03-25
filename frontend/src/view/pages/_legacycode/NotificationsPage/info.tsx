
import React from 'react'
import Message from './../MessagesPage/Message'
import { EmptyMessage, PreloaderWrapper, EmptyMessageFeed } from './../MessagesPage/styles'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
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
  messageById: ApiTypes.Feed.Message | null | undefined
  currentHub: CommonTypes.HubTypes.CurrentHub

  onGetMessagesByIdFromHub: (data: ApiTypes.Feed.MessagesById) => void
  onresetFeedMessageById: () => void
}

interface State {
  isCommentsOpen: boolean
}

class NotificationsInfo extends React.PureComponent<Props, State> {

  state = {
    isCommentsOpen: false,
  }

  getMessage = () => {
    const { onGetMessagesByIdFromHub, history } = this.props
    const parsed = queryString.parse(history.location.search)

    if (parsed?.type?.indexOf('comment') !== -1) {
      this.setState({
        isCommentsOpen: true,
      })
    }

    if (parsed?.message_id) {
      onGetMessagesByIdFromHub({
        host: parsed?.sourceHost as string,
        body: {
          token: parsed?.messageToken as string,
          message_id: parsed?.message_id as string,
        }
      })
    }
  }

  componentDidMount() {
    this.getMessage()
  }

  componentWillUnmount() {
    this.props.onresetFeedMessageById()
  }

  render() {
    const { messageById, history } = this.props
    const { isCommentsOpen } = this.state

    if (messageById === null) {
      return (
        <EmptyMessageFeed>
          <PreloaderWrapper>
            <CircularProgress />
          </PreloaderWrapper>
        </EmptyMessageFeed>
      )
    }
    if (messageById === undefined) {
      return (
        <ContainerStyled maxWidth="md">
          <EmptyMessage>
            Sorry, message not found or has been removed
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
              onClick={() => history.push('/feed')}
            >Messages</Button>
          </ButtonsWrapper>
        </ContainerStyled>
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
              onClick={() => history.push('/feed')}
            >Messages</Button>
          </ButtonsWrapper>
        </ContainerStyled>
      )
    }
  }
}

type StateProps = Pick<Props, 'messageById' | 'currentHub'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  messageById: selectors.feed.messageById(state),
  currentHub: selectors.feed.currentHub(state),
})

type DispatchProps = Pick<Props, 'onresetFeedMessageById' | 'onGetMessagesByIdFromHub'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessagesByIdFromHub: (data: ApiTypes.Feed.MessagesById) => dispatch(Actions.feed.getFeedMessagesByIdFromHubRequest(data)),
  onresetFeedMessageById: () => dispatch(Actions.feed.resetFeedMessageById()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsInfo)