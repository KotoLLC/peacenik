import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ApiTypes, StoreTypes } from 'src/types'
import Actions from '@store/actions'
import { ModalDialog } from '@view/shared/ModalDialog'
import { TimeBlock, AccessTimeIconStyled } from '@view/shared/styles'
import { getAvatarUrl } from '@services/avatarUrl'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import { YoutubeFrame } from './YoutubeFrame'
import IconButton from '@material-ui/core/IconButton'
import { LinkRenderer } from '@view/shared/LinkRenderer'
import { Player } from 'video-react'
import Comment from './Comment'
import { MentionsInput, Mention } from 'react-mentions'
import SendIcon from '@material-ui/icons/Send'
import { urlify } from '@services/urlify'
import selectors from '@selectors/index'
import { friendsToMentionFriends, MentionFriend } from '@services/dataTransforms/friendsToMentionFriends'
import { getUserNameByUserId } from '@services/userNames'
import {
  FeedHeader,
  UserInfo,
  AvatarWrapperLink,
  AvatarStyled,
  UserNameLink,
  FeedText,
  FeedAttachmentWrapper,
  ReactionNavItem,
  ImagePreview,
  EditorContentWrapper,
  MentionsInputWrapper,
  EditorButtonsWrapper,
  ButtonSend,
  CommentEditorWrapper,
} from './styles'

interface Props extends ApiTypes.Feed.Comment {
  userId: string
  userName: string
  userFullName: string

  onCommentPost: (data: ApiTypes.Feed.PostComment) => void
}

const CommentsDialog = (props) => {
  const {
    user_id,
    user_name,
    created_at,
    message,
    isAttacmentDeleted,
    attachment_type,
    attachment,
    comments,
    sourceHost,
    friends,
    messageToken,
    id,
    userId,
    userName,
    userFullName,
  } = props
  const [isOpen, setOpen] = useState(false)
  const [comment, onCommentChange] = useState<string>('')
  const [mentionFriends, setMentionFriends] = useState<MentionFriend[]>([])

  const onComandEnterDownInComment = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onCommentSave()
    }
  }

  const onCommentSave = () => {
    onCommentChange('')

    props.onCommentPost({
      host: sourceHost,
      body: {
        message_id: id,
        text: urlify(comment),
        token: messageToken,
      }
    })
  }

  useEffect(() => {
    if (!mentionFriends?.length && friends?.length) {
      setMentionFriends(friendsToMentionFriends(friends))
    }
  }, [])

  const renderViewAttachment = () => {

    if (isAttacmentDeleted) {
      return null
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

  const checkIsCommentedByMe = (): boolean => {
    return comments.some(item => item?.user_id === userId)
  }

  const renderEditor = () => {
    return (
      <CommentEditorWrapper>
        <FeedHeader>
          <UserInfo>
            <AvatarWrapperLink className="small" to={`/profile/user?id=${userId}`}>
              <AvatarStyled className="small" src={getAvatarUrl(userId)} alt={userName} />
            </AvatarWrapperLink>
            <UserNameLink to={`/profile/user?id=${userId}`}>{getUserNameByUserId(userId)}</UserNameLink>
          </UserInfo>
        </FeedHeader>
        <EditorContentWrapper className="comments">
          <MentionsInputWrapper className="comments">
            <MentionsInput
              className="mentions"
              value={comment}
              placeholder="Write your comment…"
              onChange={(evant) => onCommentChange(evant.target.value)}
              onKeyDown={onComandEnterDownInComment}
            >
              <Mention
                trigger="@"
                data={mentionFriends}
                className={'mentions__mention'}
                markup="[@__display__](/profile/user?id=__id__)"
              />
            </MentionsInput>
          </MentionsInputWrapper>
        </EditorContentWrapper>
        <EditorButtonsWrapper className="comments">
          <span/>
          <ButtonSend
            className="small"
            type="submit"
            onClick={onCommentSave}>
            <SendIcon />
          </ButtonSend>
        </EditorButtonsWrapper>
      </CommentEditorWrapper>
    )
  }

  return (
    <>
      <ReactionNavItem onClick={() => setOpen(true)}>
        <IconButton>
          {
            checkIsCommentedByMe() ?
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47687 2 2 5.91813 2 10.75C2 13.5119 3.46563 15.9706 5.75 17.5744V22L10.1306 19.3419C10.7369 19.4419 11.3606 19.5 12 19.5C17.5225 19.5 22 15.5825 22 10.75C22 5.91813 17.5225 2 12 2Z" fill="#599C0B" />
              </svg> :
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 17.5744V17.3145L6.03729 17.1652C3.86562 15.6405 2.5 13.3253 2.5 10.75C2.5 6.25486 6.68825 2.5 12 2.5C17.3111 2.5 21.5 6.25488 21.5 10.75C21.5 15.2457 17.3112 19 12 19C11.391 19 10.7946 18.9446 10.212 18.8485L10.0294 18.8184L9.87125 18.9144L6.25 21.1118V17.5744Z" stroke="#A1AEC8" />
              </svg>
          }
        </IconButton>
      </ReactionNavItem>
      <ModalDialog
        title="Add your comment"
        isModalOpen={isOpen}
        className="comments"
        setOpenModal={() => setOpen(!isOpen)}>
        <FeedHeader className="comments">
          <UserInfo>
            <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
              <AvatarStyled src={getAvatarUrl(user_id)} alt={getUserNameByUserId(user_id)} />
            </AvatarWrapperLink>
            <UserNameLink to={`/profile/user?id=${user_id}`}>{getUserNameByUserId(user_id)}</UserNameLink>
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
          {renderViewAttachment()}
        </FeedAttachmentWrapper>
        {comments?.map(item => (
          <Comment
            {...item}
            key={item.id}
            sourceHost={sourceHost}
          />
        ))}
        {renderEditor()}
      </ModalDialog>
    </>
  )
}

type StateProps = Pick<Props, 'userId' | 'userName' | 'userFullName'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
  userName: selectors.profile.userName(state),
  userFullName: selectors.profile.userFullName(state),
})

type DispatchProps = Pick<Props, 'onCommentPost'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onCommentPost: (data: ApiTypes.Feed.PostComment) => dispatch(Actions.feed.postFeedCommentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentsDialog)