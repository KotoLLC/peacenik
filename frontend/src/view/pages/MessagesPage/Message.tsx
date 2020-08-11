import React, { useState, useEffect, ChangeEvent } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import RemoveMessageDialog from './RemoveMessageDialog'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import Comment from './Comment'
import selectors from '@selectors/index'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Player } from 'video-react'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import Badge from '@material-ui/core/Badge'
import noAvatar from './../../../assets/images/no-avatar.png'
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
  ImagePreview,
  AttachmentWrapper,
  EditorButtonsWrapper,
  UploadInput,
  CircularProgressStyled,
  AvatarWrapper,
} from './styles'

interface Props extends ApiTypes.Messages.Message {
  isAuthor: boolean
  uploadLink: ApiTypes.UploadLink | null
  currentNode: CommonTypes.NodeTypes.CurrentNode
  currentMessageLikes: ApiTypes.Messages.LikesInfoData | null
  
  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => void
  onCommentPost: (data: ApiTypes.Messages.PostComment) => void
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => void
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => void
  onResetMessageUploadLink: () => void
  onLikeMessage: (data: ApiTypes.Messages.Like) => void
  getLikesForMessage: (data: ApiTypes.Messages.Like) => void
}

const Message: React.SFC<Props> = (props) => {
  const {
    text,
    user_name,
    created_at,
    isAuthor,
    id,
    sourceHost,
    messageToken,
    comments,
    avatar_thumbnail,
    attachment,
    attachment_type,
    uploadLink,
    onResetMessageUploadLink,
    onLikeMessage,
    getLikesForMessage,
    likes,
    currentMessageLikes,
    liked_by_me,
  } = props

  const [isEditer, setEditor] = useState<boolean>(false)
  const [isCommentsEditer, setCommentsEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)
  const [comment, onCommentChange] = useState<string>('')
  const [isCommentsOpen, openComments] = useState<boolean>(false)
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLikesInfoRequested, setLikesInfoRequest] = useState<boolean>(false)

  const onMessageSave = () => {
    props.onMessageEdit({
      host: sourceHost,
      body: {
        message_id: id,
        text: message,
        text_changed: true,
        attachment_changed: (file?.name) ? true : false,
        attachment_id: (file?.name) && uploadLink?.blob_id,
      }
    })
    setEditor(false)
    onResetMessageUploadLink()
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

  const rendreLikeButton = () => {
    let likesInfo = 'No likes yet'
    let usersLikes = ''

    if (currentMessageLikes?.id === id) {
      currentMessageLikes.likes.length && currentMessageLikes.likes.forEach((item, counter) => {
        
        if (counter < 15) {
          const comma = ((currentMessageLikes.likes.length - 1) === counter) ? '' : ', '
          usersLikes += `${item.user_name}${comma}`
        } 

        if (counter === 15) {
          usersLikes += `...`
        }
        
      })
    }

    return (
      <Tooltip 
        onClick={() => onLikeMessage({ host: sourceHost, id: id })}
        title={(isLikesInfoRequested) ? <CircularProgressStyled size={30}/> : <>{usersLikes || likesInfo}</>} 
        interactive onOpen={() => getLikesInfo()}>
        <IconButton>
          <Badge badgeContent={likes} color="primary">
            {liked_by_me ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
    )
    
  }

  const renderNavIcons = () => {
    if (isAuthor) {
      return (
        <ButtonsWrapper>
          {rendreLikeButton()}
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Comment`}>
            <IconButton onClick={() => setCommentsEditor(!isCommentsEditer)}>
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Tooltip>
          <RemoveMessageDialog {...{ message, id, sourceHost }} />
        </ButtonsWrapper>
      )
    } else {
      return (
        <ButtonsWrapper>
          {rendreLikeButton()}
          <Tooltip title={`Comment`}>
            <IconButton onClick={() => setCommentsEditor(!isCommentsEditer)}>
              <ChatBubbleOutlineIcon />
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
            <Comment
              {...item}
              key={item.id}
              sourceHost={sourceHost}
            />
          ))}
        </CommentsWrapepr>
      )
    }
  }

  const renderAttachment = () => {
    if (file?.name && file?.type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={URL.createObjectURL(file)} />
        </AttachmentWrapper>
      )
    }

    if (file?.name && file?.type.indexOf('video') !== -1) {
      return (
        <AttachmentWrapper>
          <Player>
            <source src={URL.createObjectURL(file)} />
          </Player>
        </AttachmentWrapper>
      )
    }

    if (attachment_type && attachment_type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={attachment} />
        </AttachmentWrapper>
      )
    }

    if (attachment_type && attachment_type.indexOf('video') !== -1) {
      return (
        <AttachmentWrapper>
          <Player>
            <source src={attachment} />
          </Player>
        </AttachmentWrapper>
      )
    }

    return null
  }

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetMessageUploadLink } = props
    setUploadedFile(false)

    const uploadedFile = event.target.files
    if (uploadedFile && uploadedFile[0]) {
      onGetMessageUploadLink({
        host: props.currentNode.host,
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      })
      setFile(uploadedFile[0])
    }
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
  },  [props, file, isFileUploaded, id])

  return (
    <>
      <PaperStyled>
        <MessageHeader>
          <UserInfo>
            <AvatarWrapper>
              <Avatar variant="rounded" src={avatar_thumbnail || noAvatar} />
            </AvatarWrapper>
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
              <EditorButtonsWrapper>
                <Tooltip title={`Attach image or video`}>
                  <IconButton component="label">
                    <AttachFileIcon fontSize="small" color="primary" />
                    <UploadInput
                      type="file"
                      id="file"
                      name="file"
                      onChange={onFileUpload}
                      accept="video/*,image/*"
                    />
                  </IconButton>
                </Tooltip>
                <ButtonSend
                  variant="contained"
                  color="primary"
                  onClick={onMessageSave}
                >Save</ButtonSend>
              </EditorButtonsWrapper>
            </EditMessageWrapper>
            : <MessageContent>{message}</MessageContent>
        }
        {renderAttachment()}
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

type StateProps = Pick<Props, 'uploadLink' | 'currentNode' | 'currentMessageLikes'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  uploadLink: state.messages.uploadLink,
  currentNode: selectors.messages.currentNode(state),
  currentMessageLikes: selectors.messages.currentMessageLikes(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Message)