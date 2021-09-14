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
import FeedPost from '../components/FeedPost'
import CommentDialog from '../components/CommentDialog'
import { API } from '@services/api'
import queryString from 'query-string'
import { getPublicPostUserName } from '@services/userNames';

import {
  ContainerStyled,
  EmptyMessageFeed,
  UpButton,
  PreloaderWrapper,
} from '../components/styles'

interface Props extends RouteComponentProps {
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  currentHub: CommonTypes.HubTypes.CurrentHub
  isCurrentHubRequested: boolean
  messages: ApiTypes.Feed.Message[]
  userId: string
  authToken: string
  isMoreMessagesRequested: boolean
  isMessagesRequested: boolean | null
  isAboutUsViewed: boolean
  friends: ApiTypes.Friends.Friend[] | null
  postUpdated: boolean
  isLogged: boolean
  publicMsgToken: ApiTypes.HubToken | null

  onGetFriends: () => void
  onGetMessages: () => void
  onGetMoreMessages: () => void
  onGetMorePublicMessages: (data) => void
  onGetCurrentHub: () => void
  onSetPostUpdated: (data) => void
  onGetPublicPosts: (data) => void
}

interface State {
  authToken: string
  messageLenght: number
  isPopupOpen: boolean
  popupData: CommonTypes.PopupData,
  userId: string | null,
  msgId: string | null,
  publicUserName: string
}

class FeedPage extends React.Component<Props, State> {

  state = {
    authToken: '',
    messageLenght: 0,
    isPopupOpen: false,
    userId: null,
    msgId: null,
    publicUserName: '',
    popupData: {
      created_at: "",
      message: null,
      isAttacmentDeleted: false,
      attachment_type: "",
      attachment: "",
      comments: [],
      sourceHost: "",
      messageToken: "",
      id: "",
      user_id: "",
      friends: null,
    }
  }

  timerId

  editorRef = React.createRef<HTMLDivElement>()
  lastMessageRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    const {
      onGetMessages,
      onGetCurrentHub,
      onGetFriends,
      onGetPublicPosts,
      authToken,
      location,
      history,
    } = this.props

    const url = location.search
    const params = queryString.parse(url)
    const currentUserId = params.userid ? params.userid as string : null
    // const msgId = params.msgid ? params.msgid as string : null

    if (authToken) {
      onGetMessages()
      onGetCurrentHub()
      onGetFriends()

      this.timerId = setInterval(() => {
        onGetMessages()
      }, 10000)
    } else if (currentUserId){
      onGetPublicPosts(currentUserId)
      this.setState({
        userId: currentUserId
      })
      // this.timerId = setInterval(() => {
      //   onGetPublicPosts(currentUserId)
      // }, 10000)
    } else {
      history.push('/login')
    }

    window.addEventListener('scroll', this.onScrollList)
  }

  onScrollList = () => {
    const { isMoreMessagesRequested, messages, isLogged } = this.props
    const { messageLenght } = this.state
    const lastMessageRect = this.lastMessageRef?.current?.getBoundingClientRect()

    if (!lastMessageRect) return

    if (lastMessageRect?.top <= window.innerHeight && isMoreMessagesRequested !== true) {
      if (messages?.length !== messageLenght) {
        if ( isLogged ) {
          this.props.onGetMoreMessages()
        } else {
          this.props.onGetMorePublicMessages(this.state.userId)
        }
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
              showCommentPopup={this.showCommentPopup}
              publicUserName={this.state.publicUserName}
              isAuthor={(userId === item.user_id) ? true : false} />
          </div>
        )
      }

      return <FeedPost
        {...item}
        key={item.id}
        showCommentPopup={this.showCommentPopup}
        publicUserName={this.state.publicUserName}
        isAuthor={(userId === item.user_id) ? true : false} />
    })

    return renderData
  }

  showCommentPopup = (displayData: CommonTypes.PopupData) => {
    this.setState({
      popupData: {
        created_at: displayData.created_at,
        message: displayData.message,
        isAttacmentDeleted: displayData.isAttacmentDeleted,
        attachment_type: displayData.attachment_type,
        attachment: displayData.attachment,
        comments: displayData.comments,
        sourceHost: displayData.sourceHost,
        messageToken: displayData.messageToken,
        id: displayData.id,
        user_id: displayData.user_id,
        friends: displayData.friends,
      }
    })
    this.setPopupOpen(true)
  }

  setPopupOpen = (bOpen: boolean) => {
    this.setState({
      isPopupOpen: bOpen
    })
  }

  onScrollUp = () => {
    console.log("editorRef: ", this.editorRef)
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
    const { messages, isCurrentHubRequested, isLogged } = this.props

    if (isCurrentHubRequested) {
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
          {isLogged && <div ref={this.editorRef}><Editor /></div>}
          {this.mapMessages(messages)}
          <CommentDialog
            isOpen={this.state.isPopupOpen}
            setOpen={this.setPopupOpen}
            popupData={this.state.popupData}
            publicUserName={this.state.publicUserName}
          />
        </>
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isMessagesRequested,
      feedsTokens,
      isAboutUsViewed,
      currentHub,
      postUpdated,
      publicMsgToken
    } = this.props
    const parsed = queryString.parse(this.props.history.location.search)

    if (isAboutUsViewed) return false

    if (isMessagesRequested === false && !feedsTokens.length && !currentHub?.token) {
      this.props.history.push('/no-hubs')
    }

    let messageId = parsed?.message_id as string
    let msgid = parsed?.msgid as string
    let userid = parsed?.userid as string

    if (prevState.publicUserName === '' && publicMsgToken) {
      getPublicPostUserName(userid, publicMsgToken).then(res => {
        this.setState({
          publicUserName: res
        })
      })
    }

    if (messageId) {
      this.props.history.replace({
        search: "",
      })

      API.feed.getMessageById({
        host: parsed?.sourceHost as string,
        body: {
          token: parsed?.messageToken as string,
          message_id: parsed?.message_id as string,
        }
      }).then((response: any) => {
        this.showCommentPopup({
          created_at: response.data.message.created_at,
          message: response.data.message.text,
          isAttacmentDeleted: false,
          attachment_type: response.data.message.attachment_type,
          attachment: response.data.message.attachment,
          comments: response.data.message.comments,
          sourceHost: parsed?.sourceHost as string,
          messageToken: parsed?.messageToken as string,
          id: response.data.message.id,
          user_id: response.data.message.user_id,
          friends: []
        })
      }).catch(error => {
        console.log("GET MESSAGE ERROR: ", error)
      })
    } else if (postUpdated) {
      API.feed.getMessageById({
        host: this.state.popupData.sourceHost,
        body: {
          token: this.state.popupData.messageToken,
          message_id: this.state.popupData.id,
        }
      }).then((response: any) => {
        this.setState({
          popupData: {
            created_at: response.data.message.created_at,
            message: response.data.message.text,
            isAttacmentDeleted: false,
            attachment_type: response.data.message.attachment_type,
            attachment: response.data.message.attachment,
            comments: response.data.message.comments,
            sourceHost: this.state.popupData.sourceHost,
            messageToken: this.state.popupData.messageToken,
            id: response.data.message.id,
            user_id: response.data.message.user_id,
            friends: []
          }
        })
        this.props.onSetPostUpdated(false)
      }).catch(error => {
        console.log("GET MESSAGE ERROR 2: ", error)
      })
    }

    if ( publicMsgToken && publicMsgToken.host && msgid) {
      this.props.history.replace({
        search: "userid=" + userid,
      })
      API.feed.getPublicPostById({
        host: publicMsgToken?.host,
        token: publicMsgToken?.token,
        message_id: msgid
      }).then((response: any) => {
        this.showCommentPopup({
          created_at: response.data.message.created_at,
          message: response.data.message.text,
          isAttacmentDeleted: false,
          attachment_type: response.data.message.attachment_type,
          attachment: response.data.message.attachment,
          comments: response.data.message.comments,
          sourceHost: publicMsgToken?.host ? publicMsgToken.host : '',
          messageToken: publicMsgToken?.token ? publicMsgToken.token : '',
          id: response.data.message.id,
          user_id: response.data.message.user_id,
          friends: []
        })
        this.setPopupOpen(true)
      }).catch(error => {
        console.log("getPublicPostById: ", error)
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
  | 'isCurrentHubRequested'
  | 'friends'
  | 'postUpdated'
  | 'isLogged'
  | 'publicMsgToken'
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
  isCurrentHubRequested: selectors.feed.isCurrentHubRequested(state),
  friends: selectors.friends.friends(state),
  postUpdated: selectors.feed.postUpdated(state),
  isLogged: selectors.authorization.isLogged(state),
  publicMsgToken: selectors.feed.publicMsgToken(state)
})

type DispatchProps = Pick<Props,
  | 'onGetMessages'
  | 'onGetCurrentHub'
  | 'onGetMoreMessages'
  | 'onGetMorePublicMessages'
  | 'onGetFriends'
  | 'onSetPostUpdated'
  | 'onGetPublicPosts'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetPublicPosts: (data) => dispatch(Actions.feed.getFeedPublicPosts(data)),
  onGetMessages: () => dispatch(Actions.feed.getFeedTokensRequest()),
  onGetCurrentHub: () => dispatch(Actions.feed.getCurrentHubRequest()),
  onGetMoreMessages: () => dispatch(Actions.feed.getMoreFeedRequest()),
  onGetMorePublicMessages: (data) => dispatch(Actions.feed.getMorePublicFeedRequest(data)),
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onSetPostUpdated: (data) => dispatch(Actions.feed.setPostUpdated(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage)