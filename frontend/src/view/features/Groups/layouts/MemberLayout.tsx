import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import GroupCoverBar from './../components/GroupCoverBar'
import { Member } from './../components/Member'
import { Owner } from './../components/Owner'
import { v4 as uuidv4 } from 'uuid'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import queryString from 'query-string'
import { sortByDate } from '@services/sortByDate'
import PullToRefresh from 'react-simple-pull-to-refresh'
import Editor from '../../Feed/components/Editor'
import CircularProgress from '@material-ui/core/CircularProgress'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Actions from '@store/actions'
import FeedPost from '../../Feed/components/FeedPost'
import CommentDialog from '../../Feed/components/CommentDialog'
import {
  UpButton,
} from '../../Feed/components/styles'

import { 
  Container, 
  PageCover,
  ProfileAvatar, 
  LeftSideBar,
  RightSideBar,
  CentralBar, 
  PageColumnBarsWrapper,
  PageBarTitle,
  ProfileName,
  ProfileNote,
  GroupCard,
 } from '@view/shared/styles'
import {
  GroupDescriptopn,
} from './../components/styles'

interface Props {
  state: any
  messages: ApiTypes.Feed.Message[]
  userId: string
  location: any
  groupMessageToken: CommonTypes.GroupTypes.GroupMsgToken
  feedsTokens: CommonTypes.HubTypes.CurrentHub[]
  groupDetails?: ApiTypes.Groups.GroupDetails | null
  
  onGetGroupMessages: (data: ApiTypes.Feed.MessagesByGroupId) => void
  onGetGroupMessagesToken: (data: ApiTypes.Feed.MessagesByGroupId) => void
}

const MemberLayout: React.FC<Props> = React.memo((props) => {
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
    
    onGetGroupMessages,
    onGetGroupMessagesToken
   } = props

  //  console.log("MEMBER LAYOUT: ", props)
  const parsed = queryString.parse(location.search)
  let timerId: any = null
  let msgToken: string = ""
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
    // console.log("OWNED HUB: ", groupMessageToken.host)
    timerId = setInterval(() => {
      getGroupMsg()
    }, 10000)

    return () => {
      clearInterval(timerId)
    }
  }, [groupMessageToken])

  if (!groupDetails) return null

  const { group, members, status } = groupDetails
  
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
          groupId={group?.id}
          isAdminLayout={false}
          memberStatus={status}
          isPublic={group?.is_public}
        />
        <Container>
          <PageColumnBarsWrapper>
            <LeftSideBar>
              <ProfileAvatar src={getGroupAvatarUrl(group?.id)} />
              <ProfileName>{group?.name}</ProfileName>
              <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
              <GroupDescriptopn>{group?.description}</GroupDescriptopn>
              <GroupCoverBar
                className="mobile-only"
                groupId={group?.id}
                isPublic={group?.is_public}
                isAdminLayout={false}
                memberStatus={status}
              />
            </LeftSideBar>
            <CentralBar>
              {checkCurrentHub()}
              {/* <ViewMoreButton>View more</ViewMoreButton> */}
            </CentralBar>
            <RightSideBar>
              <GroupCard>
                <PageBarTitle>Owner</PageBarTitle>
                <Owner {...group.admin} />
              </GroupCard>
              <GroupCard>
                <PageBarTitle>Members ({members?.length})</PageBarTitle>
                {Boolean(members?.length) && members.map(item => (
                  <Member
                    groupId={group?.id}
                    isAdminLayout={false}
                    key={uuidv4()}
                    {...item}
                  />
                ))}
                {/* <ViewMoreButton>View more</ViewMoreButton> */}
              </GroupCard>
            </RightSideBar>
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
  | 'messages' 
  | 'userId' 
  | 'groupMessageToken' 
  | 'feedsTokens'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  state: state,
  groupDetails: selectors.groups.groupDetails(state),
  messages: selectors.feed.groupMessages(state),
  userId: selectors.profile.userId(state),
  groupMessageToken: selectors.feed.groupMessageToken(state),
  feedsTokens: selectors.feed.feedsTokens(state)
})

type DispatchProps = Pick<Props, 
  'onGetGroupMessages' 
  | 'onGetGroupMessagesToken'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupMessagesToken: (data: ApiTypes.Feed.MessagesByGroupId) => dispatch(Actions.feed.getGroupFeedTokenRequest(data)),
  onGetGroupMessages: (data: ApiTypes.Feed.MessagesByGroupId) => dispatch(Actions.feed.getGroupFeedRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MemberLayout)
