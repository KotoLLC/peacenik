import React, { useState, useEffect, ChangeEvent, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import Comment from './Comment'
import selectors from '@selectors/index'
import { Player } from 'video-react'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl'
import { TimeBlock, AccessTimeIconStyled } from '@view/shared/styles'
import Tooltip from '@material-ui/core/Tooltip'
import commentIconContained from '@assets/images/comment-icon-contained.svg'
import likeIconContained from '@assets/images/like-icon-contained.svg'
import likeIconContainedRed from '@assets/images/like-icon-contained-red.svg'
import likeIconOutlined from '@assets/images/like-icon-outlined.svg'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { MentionsInput, Mention } from 'react-mentions'
import { friendsToMentionFriends, MentionFriend } from '@services/dataTransforms/friendsToMentionFriends'
import { LinkRenderer } from '@view/shared/LinkRenderer'
import { YoutubeFrame } from './YoutubeFrame'
import Badge from '@material-ui/core/Badge'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { AuthorButtonsMenu } from './AuthorButtonsMenu'
import { NoAuthorButtonsMenu } from './NoAuthorButtonsMenu'
import IconButton from '@material-ui/core/IconButton'
import {
  FeedWrapper,
  FeedHeader,
  UserInfo,
  AvatarWrapperLink,
  AvatarStyled,
  UserNameLink,
  FeedText,
  FeedAttachmentWrapper,
  ActionCountersWrapper,
  ActionCounterIcon,
  ActionCounter,
  ImagePreview,
  ReactionsWrapper,
  LikesWrapper,
  LikesNamesList,
  CircularProgressStyled,
  FeedFooter,
  ReactionNawWrapper,
  ReactionNavItem,
} from './styles'

interface Props extends ApiTypes.Messages.Message {
  isAuthor: boolean
  uploadLink: ApiTypes.UploadLink | null
  currentHub: CommonTypes.HubTypes.CurrentHub
  currentMessageLikes: ApiTypes.Messages.LikesInfoData | null
  isCommentsOpenByDeafult?: boolean
  friends: ApiTypes.Friends.Friend[] | null

  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => void
  onCommentPost: (data: ApiTypes.Messages.PostComment) => void
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => void
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => void
  onResetMessageUploadLink: () => void
  onLikeMessage: (data: ApiTypes.Messages.Like) => void
  getLikesForMessage: (data: ApiTypes.Messages.Like) => void
  callback?: () => void
}

const FeedPost: React.FC<Props> = React.memo((props) => {
  const {
    text,
    user_name,
    user_full_name,
    created_at,
    isAuthor,
    id,
    sourceHost,
    messageToken,
    comments,
    attachment,
    attachment_type,
    uploadLink,
    onResetMessageUploadLink,
    onLikeMessage,
    getLikesForMessage,
    likes,
    currentMessageLikes,
    liked_by_me,
    user_id,
    liked_by,
    isCommentsOpenByDeafult,
    callback,
    friends,
  } = props

  const [isEditer, setEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)
  const [comment, onCommentChange] = useState<string>('')
  const [isCommentsOpen, openComments] = useState<boolean>(isCommentsOpenByDeafult || false)
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [isAttacmentDeleted, onAttachmentDelete] = useState<boolean>(false)
  const [isLikesInfoRequested, setLikesInfoRequest] = useState<boolean>(false)
  const [mentionFriends, setMentionFriends] = useState<MentionFriend[]>([])
  const userName = user_full_name || user_name

  const renderAttachment = () => {

    if (isAttacmentDeleted) {
      return null
    }

    if (file?.size && file?.type.indexOf('image') !== -1) {
      return <ImagePreview src={URL.createObjectURL(file)} />
    }

    if (file?.name && file?.type.indexOf('video') !== -1) {
      return (
        <Player>
          <source src={URL.createObjectURL(file)} />
        </Player>
      )
    }

    if (attachment_type && attachment_type.indexOf('image') !== -1) {
      return <ImagePreview src={attachment} />
    }

    if (attachment_type && attachment_type.indexOf('video') !== -1) {
      return (
        <Player>
          <source src={attachment} />
        </Player>
      )
    }

    return null
  }

  const getLikesInfo = () => {
    if (currentMessageLikes?.id === id) {
      setLikesInfoRequest(false)
    }

    if (currentMessageLikes?.id !== id) {
      setLikesInfoRequest(true)
      getLikesForMessage({
        host: sourceHost,
        id: id
      })
    }
  }

 /* 
  const rendreLikeButton = () => {
    let likesInfo = 'No likes yet'
    let usersLikes = ''

    if (currentMessageLikes?.id === id) {
      currentMessageLikes.likes.length && currentMessageLikes.likes.forEach((item, counter) => {

        if (counter < 15) {
          const likedByUserName = item.user_full_name || item.user_name
          const comma = ((currentMessageLikes.likes.length - 1) === counter) ? '' : ', '
          usersLikes += `${likedByUserName}${comma}`
        }

        if (counter === 15) {
          usersLikes += `...`
        }

      })
    }

    return (
      <Tooltip
        title={(isLikesInfoRequested) ? <CircularProgressStyled size={30} /> : <>{usersLikes || likesInfo}</>}
        interactive onOpen={() => getLikesInfo()}>
        <ActionCounter>
          <ActionCounterIcon src={likeIconContained} /><b>{likes || 0}</b> likes
        </ActionCounter>
      </Tooltip>
    )
  }
  */

  const renderReactions = () => {
    return (
      <ActionCountersWrapper>
        <ActionCounter>
          <ActionCounterIcon src={likeIconContained} /><b>{likes || 0}</b> likes
        </ActionCounter>
        <ActionCounter>
          <ActionCounterIcon src={commentIconContained} /><b>{comments?.length || 0}</b> comments
        </ActionCounter>
      </ActionCountersWrapper>
    )
  }

  const renderReactionNav = () => {
    return (
      <ReactionNawWrapper>
        <ReactionNavItem onClick={() => {
          if (liked_by_me) {
            onLikeMessage({ host: sourceHost, id: id, unlike: true })
          } else {
            onLikeMessage({ host: sourceHost, id: id })
          }
        }}>
          <IconButton>
            {liked_by_me ?
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.0077 4C14.1144 4 12.9291 4.77191 11.9856 6C10.9869 4.75271 9.88251 4 8.01922 4C5.17209 4.00472 2.31913 6.13431 2.00633 9C2.00491 9.19919 1.94411 9.88212 2.2307 10.9956C2.64509 12.6019 3.96243 14.1768 5.3564 15.3333L12.0135 21L18.6705 15.3333C20.0645 14.1759 21.3818 12.6019 21.7962 10.9956C22.0828 9.88212 21.9889 9.19919 21.9712 9C21.6744 6.13197 18.8505 4 16.0077 4Z" fill="#DB391F" />
              </svg> :
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5953 6.3125L11.9937 6.81013L12.3821 6.30462C12.8229 5.7308 13.3035 5.28529 13.8754 4.98083C14.4451 4.6776 15.1322 4.5 16.0077 4.5C18.6414 4.5 21.2061 6.48185 21.4735 9.04844C21.4745 9.0597 21.4758 9.07251 21.4772 9.08687C21.4995 9.31078 21.5593 9.91022 21.312 10.871C20.9359 12.3283 19.7121 13.8186 18.3511 14.9486L18.3511 14.9486L18.3464 14.9526L12.0135 20.3434L5.68049 14.9526L5.68052 14.9526L5.67565 14.9485C4.31481 13.8195 3.09084 12.3282 2.71484 10.8707C2.47748 9.94831 2.49588 9.35698 2.50419 9.09031C2.50486 9.0688 2.50546 9.0494 2.50586 9.03211C2.79831 6.47767 5.38476 4.50457 8.01964 4.5C8.87959 4.50006 9.53731 4.67269 10.0881 4.97169C10.6435 5.27318 11.1206 5.7196 11.5953 6.3125Z" stroke="#A1AEC8" />
              </svg>
            }
          </IconButton>
        </ReactionNavItem>
        {/* <ReactionNavItem onClick={onCommentClick}>
          <ReactionNavText>
            Comment
        </ReactionNavText> */}
        {/* </ReactionNavItem> */}
      </ReactionNawWrapper>
    )
  }

  useEffect(() => {
    if (props.uploadLink && file && !isFileUploaded) {
      const { form_data } = props?.uploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', file, file?.name)

      props.onSetAttachment({
        link: props?.uploadLink.link,
        form_data: data,
      })
    }

    if (props.currentMessageLikes?.id === id) {
      setLikesInfoRequest(false)
    }

    if (!mentionFriends?.length && friends?.length) {
      setMentionFriends(friendsToMentionFriends(friends))
    }

    callback && callback()
  }, [props, file, isFileUploaded, id, callback, friends])

  return (
    <FeedWrapper>
      <FeedHeader>
        <UserInfo>
          <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
            <AvatarStyled src={getAvatarUrl(user_id)} alt={user_name} />
          </AvatarWrapperLink>
          <UserNameLink to={`/profile/user?id=${user_id}`}>{user_name}</UserNameLink>
        </UserInfo>
        <TimeBlock>
          {moment(created_at).fromNow()}
          <AccessTimeIconStyled />
        </TimeBlock>
      </FeedHeader>
      <FeedText className="markdown-body">
        <ReactMarkdown escapeHtml={true} renderers={{ link: LinkRenderer }}>{message}</ReactMarkdown>
      </FeedText>
      <FeedAttachmentWrapper>
        <YoutubeFrame text={message} />
        {renderAttachment()}
      </FeedAttachmentWrapper>
      {renderReactions()}
      <FeedFooter>
        {renderReactionNav()}
        {
          isAuthor ?
            <AuthorButtonsMenu {...{ isEditer, setEditor, message, id, sourceHost }} /> :
            <NoAuthorButtonsMenu {...{ message, id, sourceHost }} />
        }
      </FeedFooter>
    </FeedWrapper>
  )
})

type StateProps = Pick<Props, 'uploadLink' | 'currentHub' | 'currentMessageLikes' | 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  uploadLink: state.messages.uploadLink,
  currentHub: selectors.messages.currentHub(state),
  currentMessageLikes: selectors.messages.currentMessageLikes(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props,
  | 'onMessageEdit'
  | 'onCommentPost'
  | 'onGetMessageUploadLink'
  | 'onSetAttachment'
  | 'onResetMessageUploadLink'
  | 'onLikeMessage'
  | 'getLikesForMessage'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => dispatch(Actions.messages.editMessageRequest(data)),
  onCommentPost: (data: ApiTypes.Messages.PostComment) => dispatch(Actions.messages.postCommentRequest(data)),
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => dispatch(Actions.messages.getMessageUploadLinkRequest(data)),
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => dispatch(Actions.messages.setAttachmentRequest(data)),
  onResetMessageUploadLink: () => dispatch(Actions.messages.getMessageUploadLinkSucces(null)),
  onLikeMessage: (data: ApiTypes.Messages.Like) => dispatch(Actions.messages.linkMessageRequest(data)),
  getLikesForMessage: (data: ApiTypes.Messages.Like) => dispatch(Actions.messages.getLikesForMessageRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedPost)