import React, { useEffect, useState } from 'react'
import GroupCoverBar from '../components/GroupCoverBar'
import { Member } from '../components/Member'
import MemberInvited from '../components/MemberInvited'
import DeleteGroupDialog from '../components/DeleteGroupDialog'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, CommonTypes, StoreTypes } from 'src/types'
import { v4 as uuidv4 } from 'uuid'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import PullToRefresh from 'react-simple-pull-to-refresh'
import Editor from '../../Feed/components/Editor'
import CircularProgress from '@material-ui/core/CircularProgress'
import { sortByDate } from '@services/sortByDate'
import FeedPost from '../../Feed/components/FeedPost'
import queryString from 'query-string'
import CommentDialog from '../../Feed/components/CommentDialog'
import { API } from '@services/api'
import {
  UpButton,
} from '../../Feed/components/styles'

import { 
  Container, 
  PageCover,
  ProfileAvatar, 
  LeftSideBar,
  RightSideBar,
  GroupCard,
  CentralBar,
  PageColumnBarsWrapper,
  PageBarTitle,
  ProfileName,
  ProfileNote,
 } from '@view/shared/styles'
import {
  GroupDescriptopn,
  // ViewMoreButton,
} from '../components/styles'

interface Props {
  state: any
  groupDetails?: ApiTypes.Groups.GroupDetails | null
  invitesToConfirm: ApiTypes.Groups.InviteToConfirm[]
  messages: ApiTypes.Feed.Message[]
  userId: string
  isMoreMessagesRequested: boolean
  location: any
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  groupMessageToken: CommonTypes.GroupTypes.GroupMsgToken
  postUpdated: boolean

  onGetInvitesToConfirmRequest: () => void
  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => void
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => void
  onSetPostUpdated: (data) => void
}

const AdminPublicLayout: React.FC<Props> = React.memo((props) => {
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
    messages, 
    location, 
    userId,
    groupMessageToken,
    feedsTokens,
    state,
    postUpdated,
    onGetInvitesToConfirmRequest, 
    onGetGroupMessages,
    onGetGroupMessagesToken,
    onSetPostUpdated
  } = props

  let timerId: any = null
  
  let msgToken: string = feedsTokens[0].token
  feedsTokens.map( (item: CommonTypes.HubTypes.CurrentHub ) => {
    if(item.host === groupMessageToken.host)
      msgToken = item.token
  })

  const getGroupMsg = () => {
    onGetGroupMessages({
      host: groupMessageToken.host as string,
      body: {
        token: msgToken as string,
        group_id: parsed?.id as string,
      }
    })
  }

  useEffect( () => {
    onGetGroupMessagesToken({
      host: groupMessageToken.host as string,
      body: {
        token: msgToken as string,
        group_id: parsed?.id as string,
      }
    })
    
    getGroupMsg()

    timerId = setInterval(() => {
      getGroupMsg()
    }, 10000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

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
  }, [postUpdated])
  useEffect(() => {
    if (groupInvites === null && !isRequested) {
      onGetInvitesToConfirmRequest()
      setRequested(true)
    }

    if (groupDetails?.invites?.length && isRequested) {
      setGroupInvites(fixInvitesGroupId())
      setRequested(false)
    }
  }, [groupInvites, isRequested, messages])


  if (!groupDetails) return null

  const { group, members, status, invites } = groupDetails

  const parsed = queryString.parse(location.search)
  // console.log("ADMIN PUBLIC LAYOUT", props)

  const fixInvitesGroupId = () => {
    if (!groupDetails?.invites?.length) return []

    return groupDetails?.invites?.map(item => {
      item.group_id = groupDetails?.group?.id
      return item
    })
  }

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

  return (
    <PullToRefresh
      onRefresh={onRefresh}
      refreshingContent={<CircularProgress />}
    >
      <>
        <PageCover resource={getGroupCoverUrl(group?.id)} />
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
              <ProfileAvatar src={getGroupAvatarUrl(group?.id)} />
              <ProfileName>{group?.name}</ProfileName>
              <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
              <GroupDescriptopn>{group?.description}</GroupDescriptopn>
              <DeleteGroupDialog
                className="desktop-only"
                groupId={group?.id}
              />
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
              {/* <ViewMoreButton>View more</ViewMoreButton> */}
            </CentralBar>
            <RightSideBar>
              <GroupCard>
                <PageBarTitle>Waiting for approval ({invites?.length || 0})</PageBarTitle>
                {Boolean(invites?.length) && invites?.map(item => <MemberInvited
                  key={uuidv4()}
                  {...item}
                />)}
              </GroupCard>

              <GroupCard>
                <PageBarTitle>Members ({members?.length})</PageBarTitle>
                {Boolean(members?.length) && members.map(item => (
                  <Member
                    groupId={group?.id}
                    isAdminLayout={true}
                    key={uuidv4()}
                    {...item}
                  />
                ))}
              </GroupCard>
            </RightSideBar>
            <DeleteGroupDialog
              className="mobile-only"
              groupId={group?.id}
            />
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
  'state' 
  | 'groupDetails' 
  | 'invitesToConfirm' 
  | 'messages' 
  | 'userId' 
  | 'groupMessageToken' 
  | 'feedsTokens'
  | 'isMoreMessagesRequested'
  | 'postUpdated'
>
  
const mapStateToProps = (state: StoreTypes): StateProps => ({
  state: state,
  groupDetails: selectors.groups.groupDetails(state),
  messages: selectors.groups.groupMessages(state),
  userId: selectors.profile.userId(state),
  groupMessageToken: selectors.groups.groupMessageToken(state),
  feedsTokens: selectors.feed.feedsTokens(state),
  isMoreMessagesRequested: selectors.feed.isMoreMessagesRequested(state),
  invitesToConfirm: selectors.groups.invitesToConfirm(state),
  postUpdated: selectors.feed.postUpdated(state)
})

type DispatchProps = Pick<Props, 
  'onGetInvitesToConfirmRequest' 
  | 'onGetGroupMessages' 
  | 'onGetGroupMessagesToken'
  | 'onSetPostUpdated'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedTokenRequest(data)),
  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedRequest(data)),
  onGetInvitesToConfirmRequest: () => dispatch(Actions.groups.getInvitesToConfirmRequest()),
  onSetPostUpdated: (data) => dispatch(Actions.feed.setPostUpdated(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPublicLayout)
