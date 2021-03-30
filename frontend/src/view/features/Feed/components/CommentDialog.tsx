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

  onCommentPost: (data: ApiTypes.Feed.PostComment) => void
}

const CommentDialog = (props) => {
  const {
    user_id,
    userName,
    created_at,
    message,
    isAttacmentDeleted,
    attachment_type,
    attachment,
    comments,
    sourceHost,
    messageToken,
    friends,
    id,
    isOpen,
    userId,
    setOpen
  } = props
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

  useEffect(() => {
    if (!mentionFriends?.length && friends?.length) {
      setMentionFriends(friendsToMentionFriends(friends))
    }
  }, [])

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
    <ModalDialog
      title=""
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
  )
}

type StateProps = Pick<Props, 'userId' | 'userName' >
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
  userName: selectors.profile.userName(state),
})

type DispatchProps = Pick<Props, 'onCommentPost'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onCommentPost: (data: ApiTypes.Feed.PostComment) => dispatch(Actions.feed.postFeedCommentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentDialog)