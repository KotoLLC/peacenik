import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveMessageDialog from './RemoveMessageDialog'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import AddCommentIcon from '@material-ui/icons/AddComment'
import Comment from './Comment'
import { ApiTypes } from './../../../types'
import {
  PaperStyled,
  MessageHeader,
  UserInfo,
  UserName,
  MessageDate,
  UserNameWrapper,
  ButtonsWrapper,
  MessageContent,
  TextareaAutosizeStyled,
  EditMessageWrapper,
  ButtonSend,
  CommentsLink,
  CommentsLinkWrapper,
  CommentsWrapepr,
} from './styles'

interface Props extends ApiTypes.Messages.Message {
  isAuthor: boolean
  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => void
  onCommentPost: (data: ApiTypes.Messages.PostComment) => void
}

const Message: React.SFC<Props> = (props) => {
  const { text, user_name, created_at, isAuthor, id, sourceHost, messageToken, comments } = props
  const [isEditer, setEditor] = useState<boolean>(false)
  const [isCommentsEditer, setCommentsEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)
  const [comment, onCommentChange] = useState<string>('')
  const [isCommentsOpen, openComments] = useState<boolean>(false)

  const onMessageSave = () => {
    setEditor(false)
    props.onMessageEdit({
      host: sourceHost,
      body: {
        message_id: id,
        text: message,
      }
    })
  }

  const onComandEnterDownInMessage = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSave()
    }
  }
  
  const onComandEnterDownInComment = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onCommentSave()
    }
  }

  const renderNavIcons = () => {
    if (isAuthor) {
      return (
        <ButtonsWrapper>
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <RemoveMessageDialog {...{ message, id, sourceHost }} />
        </ButtonsWrapper>
      )
    } else {
      return (
        <ButtonsWrapper>
          <Tooltip title={`Comment`}>
            <IconButton onClick={() => setCommentsEditor(!isCommentsEditer)}>
              <AddCommentIcon />
            </IconButton>
          </Tooltip>
        </ButtonsWrapper>
      )
    }
  }

  const onCommentSave = () => {
    setCommentsEditor(false)
    onCommentChange('')
    props.onCommentPost({
      host: sourceHost,
      body: {
        message_id: id,
        text: comment,
        token: messageToken,
      }
    })
  }

  const mapComments = () => {
    if (isCommentsOpen) {
      return (
        <CommentsWrapepr>
          {comments?.map(item => (
            <Comment {...item} key={item.id} sourceHost={sourceHost}/>
          ))}
        </CommentsWrapepr>
      )
    }
  }

  return (
    <>
      <PaperStyled>
        <MessageHeader>
          <UserInfo>
            <Avatar variant="rounded" />
            <UserNameWrapper>
              <UserName>{user_name}</UserName>
              <MessageDate>{moment(created_at).fromNow()}</MessageDate>
            </UserNameWrapper>
          </UserInfo>
          {renderNavIcons()}
        </MessageHeader>
        {
          isEditer ?
            <EditMessageWrapper>
              <TextareaAutosizeStyled
                onKeyDown={onComandEnterDownInMessage}
                value={message}
                onChange={(evant) => onMessageChange(evant.currentTarget.value)} />
              <ButtonSend
                variant="contained"
                color="primary"
                onClick={onMessageSave}
              >Save</ButtonSend>
            </EditMessageWrapper>
            : <MessageContent>{message}</MessageContent>
        }
        {
          isCommentsEditer && <EditMessageWrapper>
            <TextareaAutosizeStyled
              onKeyDown={onComandEnterDownInComment}
              value={comment}
              onChange={(evant) => onCommentChange(evant.currentTarget.value)} />
            <ButtonSend
              variant="contained"
              color="primary"
              onClick={onCommentSave}
            >Comment</ButtonSend>
          </EditMessageWrapper>
        }
        {(comments?.length) && <CommentsLinkWrapper>
          <CommentsLink onClick={() => openComments(!isCommentsOpen)}>{comments.length} comments</CommentsLink>
        </CommentsLinkWrapper>}
      </PaperStyled>
      {mapComments()}
    </>
  )
}

type DispatchProps = Pick<Props, 'onMessageEdit' | 'onCommentPost'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => dispatch(Actions.messages.editMessageRequest(data)),
  onCommentPost: (data: ApiTypes.Messages.PostComment) => dispatch(Actions.messages.postCommentRequest(data)),
})

export default connect(null, mapDispatchToProps)(Message)