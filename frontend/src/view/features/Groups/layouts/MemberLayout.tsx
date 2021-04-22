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
import JoinGroupDialog from './../components/JoinGroupDialog'
import { API } from '@services/api'
import {
  UpButton,
} from '../../Feed/components/styles'

import { 
  ButtonOutlined, 
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
  CoverBarButtonsWrapper,
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
  isGroupLeavedSuccess: boolean
  errorMessage: string
  postUpdated: boolean

  onLeaveGroupSuccess: (value: boolean) => void
  onLeaveGroupRequest: (value: string) => void
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => void
  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => void
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => void
  onSetPostUpdated: (data) => void
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
    isGroupLeavedSuccess,
    errorMessage,
    postUpdated,
    
    onGetGroupMessages,
    onGetGroupMessagesToken,
    onLeaveGroupRequest,
    onLeaveGroupSuccess,
    onDeleteJoinRequest,
    onSetPostUpdated
  } = props

  //  console.log("MEMBER LAYOUT: ", props)
  const parsed = queryString.parse(location.search)
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
  const [isRequested, setRequested] = useState<boolean>(false)

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

  const onLeaveGroup = () => {
    setRequested(true)
    onLeaveGroupRequest(group?.id)
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
  
  // useEffect(() => {
  //   if (isGroupLeavedSuccess || errorMessage) {
  //     // setRequested(false)
  //     // onLeaveGroupSuccess(false)
  //     console.log("Strange")
  //   }
  // }, [isGroupLeavedSuccess, errorMessage])

  const renderCurrentButton = () => {
    if (status === 'member') {
      return (
        <ButtonOutlined
          onClick={onLeaveGroup}
          disabled={isRequested}
          className="extra-small grey">
          Leave group
        </ButtonOutlined>
      )
    // } else if (status === 'pending') {
    //   return <ButtonOutlined 
    //     onClick={() => onDeleteJoinRequest({
    //       group_id: group?.id,
    //     })}
    //     className="extra-small green">
    //     Remove invite
    //   </ButtonOutlined>
    // } else if (status === '' || status === 'rejected') {
    //   return <JoinGroupDialog
    //     groupId={group?.id}
    //     buttonClassName="large"
    //     buttonText="Join group"
    //   />
    }
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
        />
        <Container>
          <PageColumnBarsWrapper>
            <LeftSideBar>
              <ProfileAvatar src={getGroupAvatarUrl(group?.id)} />
              <ProfileName>{group?.name}</ProfileName>
              <ProfileNote>{group?.is_public ? 'Public' : 'Private'} group</ProfileNote>
              <GroupDescriptopn>{group?.description}</GroupDescriptopn>
              <CoverBarButtonsWrapper>
                {renderCurrentButton()}
              </CoverBarButtonsWrapper>
              <GroupCoverBar
                className="mobile-only"
                groupId={group?.id}
                isAdminLayout={false}
              />
            </LeftSideBar>
            <CentralBar>
              {(status === 'member') && checkCurrentHub()}
              {(status === 'pending') && 
                <ButtonOutlined 
                  onClick={() => onDeleteJoinRequest({
                    group_id: group?.id,
                  })}
                  className="extra-small green">
                  Remove invite
                </ButtonOutlined>}
              {(status === '' || status === 'rejected') && 
                <JoinGroupDialog
                  groupId={group?.id}
                  buttonClassName="large join-group"
                  buttonText="Join group"
                />
              }
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
  | 'isGroupLeavedSuccess'
  | 'groupDetails' 
  | 'messages' 
  | 'userId' 
  | 'groupMessageToken' 
  | 'feedsTokens'
  | 'errorMessage'
  | 'postUpdated'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  state: state,
  groupDetails: selectors.groups.groupDetails(state),
  messages: selectors.groups.groupMessages(state),
  userId: selectors.profile.userId(state),
  groupMessageToken: selectors.groups.groupMessageToken(state),
  feedsTokens: selectors.feed.feedsTokens(state),
  isGroupLeavedSuccess: selectors.groups.isGroupLeavedSuccess(state),
  errorMessage: selectors.common.errorMessage(state),
  postUpdated: selectors.feed.postUpdated(state)
})

type DispatchProps = Pick<Props, 
  'onGetGroupMessages' 
  | 'onGetGroupMessagesToken'
  | 'onLeaveGroupRequest' 
  | 'onLeaveGroupSuccess' 
  | 'onDeleteJoinRequest'
  | 'onSetPostUpdated'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupMessagesToken: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedTokenRequest(data)),
  onGetGroupMessages: (data: ApiTypes.Groups.MessagesById) => dispatch(Actions.groups.getGroupFeedRequest(data)),
  onLeaveGroupRequest: (value: string) => dispatch(Actions.groups.leaveGroupRequest(value)),
  onLeaveGroupSuccess: (value: boolean) => dispatch(Actions.groups.leaveGroupSuccess(value)),
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => dispatch(Actions.groups.deleteJoinRequest(data)),
  onSetPostUpdated: (data) => dispatch(Actions.feed.setPostUpdated(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(MemberLayout)
