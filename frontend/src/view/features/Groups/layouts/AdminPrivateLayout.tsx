import React, { useEffect, useState, useCallback } from 'react'
import GroupCoverBar from '../components/GroupCoverBar'
// import { Member } from '../components/Member'
// import UserForInvite from '../components/UserForInvite'
// import DeleteGroupDialog from '../components/DeleteGroupDialog'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import PullToRefresh from 'react-simple-pull-to-refresh'
import CircularProgress from '@material-ui/core/CircularProgress'
import queryString from 'query-string'
import { API } from '@services/api'
import {
  UpButton,
} from '../../Feed/components/styles'
import { sortByDate } from '@services/sortByDate'
import FeedPost from '../../Feed/components/FeedPost'
import Editor from '../../Feed/components/Editor'
import CommentDialog from '../../Feed/components/CommentDialog'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

// import { v4 as uuidv4 } from 'uuid'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import { 
  Container, 
  PageCover, 
  ProfileAvatar, 
  LeftSideBar,
  // RightSideBar,
  CentralBar,
  PageColumnBarsWrapper,
  // PageBarTitle,
  ProfileName,
  ProfileNote,
  // GroupCard,
} from '@view/shared/styles'
import {
  GroupDescriptopn,
} from '../components/styles'

interface Props {
  state: any
  groupDetails: ApiTypes.Groups.GroupDetails | null
  friends: ApiTypes.Friends.Friend[] | null
  messages: ApiTypes.Feed.Message[]
  location: any
  groupMessageToken: CommonTypes.GroupTypes.GroupMsgToken
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  userId: string
  postUpdated: boolean

  onGetFriends: () => void
  onGetInvitesToConfirmRequest: () => void

  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => void
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => void
  onSetPostUpdated: (data) => void
}

const AdminPrivateLayout: React.FC<Props> = React.memo((props) => {
  const [groupInvites, setGroupInvites] = useState<ApiTypes.Groups.Invite[] | null>(null)
  const [isRequested, setRequested] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false)
  const [popupData, setPopupData] = useState<CommonTypes.PopupData>({
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
  })

  const { 
    groupDetails, 
    friends,
    messages, 
    location, 
    groupMessageToken,
    feedsTokens,
    userId,
    postUpdated,

    onGetGroupMessages,
    onGetGroupMessagesToken,
    onGetInvitesToConfirmRequest, 
    onGetFriends,
    onSetPostUpdated
  } = props

  const parsed = queryString.parse(location.search)

  let msgToken: string = feedsTokens[0].token
  feedsTokens.map( (item: CommonTypes.HubTypes.CurrentHub ) => {
    if(item.host === groupMessageToken.host)
      msgToken = item.token

    return item
  })

  const getGroupMsg = useCallback(() => {
    onGetGroupMessages({
      host: groupMessageToken.host as string,
      body: {
        token: msgToken as string,
        group_id: parsed?.id as string,
      }
    })
  }, [groupMessageToken.host, msgToken, onGetGroupMessages, parsed])
  
  useEffect( () => {
    if ( postUpdated ) {
      API.feed.getMessageById({
        host: popupData.sourceHost,
        body: {
          token: popupData.messageToken,
          message_id: popupData.id,
        }
      }).then( (response: any) => {
        setPopupData({
          created_at: response.data.message.created_at,
          message: response.data.message.message,
          isAttacmentDeleted: false,
          attachment_type: response.data.message.attachment_type,
          attachment: response.data.message.attachment,
          comments: response.data.message.comments,
          sourceHost: popupData.sourceHost,
          messageToken: popupData.messageToken,
          id: response.data.message.id,
          user_id: response.data.message.user_id,
          friends: [],
        })
        onSetPostUpdated(false)
      }).catch(error => {
        console.log("GET MESSAGE ERROR 3: ", error)
      })
    }
  }, [postUpdated, onSetPostUpdated, popupData.id, popupData.messageToken, popupData.sourceHost])
  useEffect( () => {
    onGetGroupMessagesToken({
      host: groupMessageToken.host as string,
      body: {
        token: msgToken as string,
        group_id: parsed?.id as string,
      }
    })
    getGroupMsg()
    
    let timerId = setInterval(() => {
      getGroupMsg()
    }, 10000)

    return () => {
      clearInterval(timerId)
    }
  }, [getGroupMsg, groupMessageToken.host, msgToken, onGetGroupMessagesToken, parsed])

  const fixInvitesGroupId = useCallback(() => {
    if (!groupDetails?.invites?.length) return []
    
    return groupDetails?.invites?.map(item => {
      item.group_id = groupDetails?.group?.id
      return item
    })
  }, [groupDetails])

  useEffect(() => {
    if (groupInvites === null && !isRequested) {
      onGetInvitesToConfirmRequest()
      setRequested(true)
    }

    if (groupDetails?.invites?.length && isRequested) {
      setGroupInvites(fixInvitesGroupId())
      setRequested(false)
    }

    if (friends === null) {
      onGetFriends()
    }

  }, [groupInvites, isRequested, friends, groupDetails, onGetFriends, onGetInvitesToConfirmRequest, fixInvitesGroupId])

  if (!groupDetails) return null
  const { group, members, invites } = groupDetails

  const showCommentPopup = (displayData: CommonTypes.PopupData) => {
    setPopupData({
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
    })
    setPopupOpen(true)
  }

  let editorRef = React.createRef<HTMLDivElement>()
  let lastMessageRef = React.createRef<HTMLDivElement>()

  const mapMessages = (messages: ApiTypes.Feed.Message[]) => {
    const sortedData = sortByDate(messages)
    const renderData = sortedData.map((item, index) => {
      if (index === sortedData.length - 1) {
        return (
          <div ref={lastMessageRef} key={item.id}>
            <FeedPost
              {...item}
              showCommentPopup = {showCommentPopup}
              isAuthor={(userId === item.user_id) ? true : false} />
          </div>
        )
      }

      return <FeedPost
        {...item}
        key={item.id}
        showCommentPopup = {showCommentPopup}
        isAuthor={(userId === item.user_id) ? true : false} />
    })
    
    return renderData
  }

  const checkCurrentHub = () => {
    return (
      <>
        <div ref={editorRef}><Editor /></div>
        {mapMessages(messages)}
        <CommentDialog isOpen={isPopupOpen} setOpen={setPopupOpen} popupData={popupData}/>
      </>
    )
  }

  const onRefresh = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      getGroupMsg()

      setTimeout(() => {
        resolve(null)
      }, 700)
    })
  }
  const onScrollUp = () => {
    editorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  // const filterFriendsForInvite = () => {
  //   return friends?.filter((item) =>
  //     !Boolean(
  //       groupDetails?.members?.some(
  //         member => member.id === item.user.id
  //       )
  //     )
  //   )
  // }

  return (
    <PullToRefresh
      onRefresh={onRefresh}
      refreshingContent={<CircularProgress />}
    >
      <>
        <PageCover resource={getGroupCoverUrl(group?.id)}/>
        <GroupCoverBar 
          className="desktop-only"
          membersCounter={members?.length} 
          invitesCounter={invites?.length || 0} 
          groupId={group?.id} 
          isAdminLayout={true}
        />
        <Container>
          <PageColumnBarsWrapper>
            <LeftSideBar>
              <ProfileAvatar src={getGroupAvatarUrl(group?.id)}/>
              <ProfileName>{group?.name}</ProfileName>
              <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
              <GroupDescriptopn>{group?.description}</GroupDescriptopn>
              {/* <DeleteGroupDialog 
                className="desktop-only"
                groupId={group?.id} 
              /> */}
              <GroupCoverBar
                className="mobile-only"
                membersCounter={members?.length}
                invitesCounter={invites?.length || 0}
                groupId={group?.id}
                isAdminLayout={true}
              />
            </LeftSideBar>
            <CentralBar>
              {checkCurrentHub()}
            </CentralBar>
            {/* <DeleteGroupDialog
              className="mobile-only"
              groupId={group?.id}
            /> */}
          </PageColumnBarsWrapper>

          <UpButton color="inherit" onClick={onScrollUp}>
            <ArrowUpwardIcon />
          </UpButton>
        </Container>
      </>
    </PullToRefresh>
  )
})

type StateProps = Pick<Props, 
  'groupDetails' 
  | 'state' 
  | 'friends'
  | 'userId' 
  | 'messages'
  | 'groupMessageToken'  
  | 'feedsTokens'
  | 'postUpdated'
  >
const mapStateToProps = (state: StoreTypes): StateProps => ({
  state: state,
  messages: selectors.groups.groupMessages(state),
  groupMessageToken: selectors.groups.groupMessageToken(state),
  feedsTokens: selectors.feed.feedsTokens(state),
  userId: selectors.profile.userId(state),
  postUpdated: selectors.feed.postUpdated(state),
  groupDetails: selectors.groups.groupDetails(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 
  'onGetInvitesToConfirmRequest' 
  | 'onGetFriends'
  | 'onGetGroupMessagesToken'
  | 'onGetGroupMessages'
  | 'onSetPostUpdated'
  >
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedTokenRequest(data)),
  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedRequest(data)),
  onGetInvitesToConfirmRequest: () => dispatch(Actions.groups.getInvitesToConfirmRequest()),
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onSetPostUpdated: (data) => dispatch(Actions.feed.setPostUpdated(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPrivateLayout)
