import React from 'react'
import Editor from '../components/Editor'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes, CommonTypes } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import { sortByDate } from '@services/sortByDate'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import PullToRefresh from 'react-simple-pull-to-refresh'
import FeedPost from './../components/FeedPost'
import CommentDialog from '../components/CommentDialog'
import { API } from '@services/api'
import queryString from 'query-string'

import {
  ContainerStyled,
  EmptyMessageFeed,
  UpButton,
  PreloaderWrapper,
} from '../components/styles'

interface Props extends RouteComponentProps {
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubReqyested: boolean
  messages: ApiTypes.Feed.Message[]
  userId: string
  authToken: string
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  isAboutUsViewed: boolean
  friends: ApiTypes.Friends.Friend[] | null
  
  onGetFriends: () => void
  onGetMessages: () => void
  onGetMoreMessages: () => void
  onGetCurrentHub: () => void
}

interface State {
  authToken: string
  messageLenght: number
  isPopupOpen: Boolean
  popupData : PopupData
}

interface PopupData {
  created_at: any
  message: any
  isAttacmentDeleted: any
  attachment_type: any
  attachment: any
  comments: any
  sourceHost: any
  messageToken: any
  id: any
  user_id: any
  friends: any
}

class FeedPage extends React.Component<Props, State> {

  state = {
    authToken: '',
    messageLenght: 0,
    isPopupOpen: false,
    popupData: {
      created_at: "",
      message: "",
      isAttacmentDeleted: false,
      attachment_type: "",
      attachment: "",
      comments: [],
      sourceHost: "",
      messageToken: "",
      id: "",
      user_id: "",
      friends: [],
    }
  }

  timerId

  editorRef = React.createRef<HTMLDivElement>()
  lastMessageRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    const { onGetMessages, onGetCurrentHub, authToken, onGetFriends } = this.props

    if (authToken) {
      onGetMessages()
      onGetCurrentHub()
      onGetFriends()

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

      if (!newProps.friends?.length) {
        newProps.onGetFriends()
      }
      
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

  mapMessages = (messages: ApiTypes.Feed.Message[]) => {
    const { userId } = this.props
    const sortedData = sortByDate(messages)
    const renderData = sortedData.map((item, index) => {
      if (index === sortedData.length - 1) {
        return (
          <div ref={this.lastMessageRef} key={item.id}>
            <FeedPost
              {...item}
              showCommentPopup = {this.showCommentPopup}
              isAuthor={(userId === item.user_id) ? true : false} />
          </div>
        )
      }

      return <FeedPost
        {...item}
        key={item.id}
        showCommentPopup = {this.showCommentPopup}
        isAuthor={(userId === item.user_id) ? true : false} />
    })
    
    return renderData
  }

  showCommentPopup = (displayData: any) => {
    this.state.popupData.created_at = displayData.created_at
    this.state.popupData.message = displayData.message
    this.state.popupData.isAttacmentDeleted = displayData.isAttacmentDeleted
    this.state.popupData.attachment_type = displayData.attachment_type
    this.state.popupData.attachment = displayData.attachment
    this.state.popupData.comments = displayData.comments
    this.state.popupData.sourceHost = displayData.sourceHost
    this.state.popupData.messageToken = displayData.messageToken
    this.state.popupData.id = displayData.id
    this.state.popupData.user_id = displayData.user_id
    this.state.popupData.friends = displayData.friends

    this.setPopupOpen(true)
  }

  setPopupOpen = (bOpen: Boolean) => {
    this.setState({
      isPopupOpen: bOpen
    })
  }

  onScrollUp = () => {
    this.editorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  onRefresh = () => {
    return new Promise((resolve, reject) => {

      this.props.onGetMessages()
      setTimeout(() => {
        resolve(null)
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
          <CommentDialog isOpen={this.state.isPopupOpen} setOpen={this.setPopupOpen} popupData={this.state.popupData}/>
        </>
      )
    }
  }
 
  componentDidUpdate(prevProps, prevState) {
    const { isMessagesRequested, feedsTokens, isAboutUsViewed, currentHub } = this.props
    const parsed = queryString.parse(this.props.history.location.search)

    if (isAboutUsViewed) return false

    if (isMessagesRequested === false && !feedsTokens.length && !currentHub?.token) {
      this.props.history.push('/no-hubs')
    }

    let messageId = parsed?.message_id as string

    if ( messageId ) {
      this.props.history.replace({
        search: "",
      })

      API.feed.getMessageById({
        host: parsed?.sourceHost as string,
        body: {
          token: parsed?.messageToken as string,
          message_id: parsed?.message_id as string,
        }
      }).then( (response: any) => {
        this.showCommentPopup({
          created_at: response.data.message.created_at,
          message: response.data.message.text,
          isAttacmentDeleted: false,
          attachment_type: response.data.message.attachment_type,
          attachment: response.data.message.attachment,
          comments: response.data.message.comments,
          sourceHost: parsed?.sourceHost,
          messageToken: "",
          id: response.data.message.id,
          user_id: response.data.message.user_id,
          friends: []
        })
      }).catch(error => {
        console.log("GET MESSAGE ERROR: ", error)
      })
    }

  }

  render() {
    const { isMoreMessagesRequested } = this.props
    return (
      <PullToRefresh
        onRefresh={this.onRefresh}
        refreshingContent={<CircularProgress />}
      >
        <ContainerStyled>
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
  | 'feedsTokens'
  | 'currentHub'
  | 'messages'
  | 'userId'
  | 'authToken'
  | 'isMoreMessagesRequested'
  | 'isMessagesRequested'
  | 'isAboutUsViewed'
  | 'isCurrentHubReqyested'
  | 'friends'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  feedsTokens: selectors.feed.feedsTokens(state),
  currentHub: selectors.feed.currentHub(state),
  messages: selectors.feed.messages(state),
  userId: selectors.profile.userId(state),
  authToken: selectors.authorization.authToken(state),
  isMoreMessagesRequested: selectors.feed.isMoreMessagesRequested(state),
  isMessagesRequested: selectors.feed.isMessagesRequested(state),
  isAboutUsViewed: selectors.common.isAboutUsViewed(state),
  isCurrentHubReqyested: selectors.feed.isCurrentHubRequested(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 
  | 'onGetMessages' 
  | 'onGetCurrentHub' 
  | 'onGetMoreMessages'
  | 'onGetFriends'
  >
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.feed.getFeedTokensRequest()),
  onGetCurrentHub: () => dispatch(Actions.feed.getCurrentHubRequest()),
  onGetMoreMessages: () => dispatch(Actions.feed.getMoreFeedRequest()),
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage)