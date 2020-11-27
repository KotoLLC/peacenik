import React, { useState, useEffect, ChangeEvent, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import Comment from './Comment'
import selectors from '@selectors/index'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Player } from 'video-react'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import Badge from '@material-ui/core/Badge'
import SendIcon from '@material-ui/icons/Send'
import LayersClearIcon from '@material-ui/icons/LayersClear'
import { getAvatarUrl } from '@services/avatarUrl'
import Avatar from '@material-ui/core/Avatar'
import loadImage from 'blueimp-load-image'
import { AuthorButtonsMenu } from './AuthorButtonsMenu'
import { NoAuthorButtonsMenu } from './NoAuthorButtonsMenu'
import PhotoIcon from '@material-ui/icons/Photo'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { urlify } from '@services/urlify'
import { YoutubeFrame } from './YoutubeFrame'
import {
  PaperStyled,
  MessageHeader,
  UserInfo,
  AvatarWrapperLink,
  UserNameLink,
  MessageDate,
  UserNameWrapper,
  MessageContent,
  TextareaAutosizeStyled,
  EditMessageField,
  CommentsLink,
  ReactionsWrapper,
  CommentsWrapepr,
  ImagePreview,
  AttachmentWrapper,
  EditorButtonsWrapper,
  UploadInput,
  CircularProgressStyled,
  LikesNamesList,
  LikesWrapper,
  ReactionNavWrapper,
  ReactionNavText,
  ReactionNavItem,
  EditMessageWrapper,
  EditorInMessageWrapper,
  IconButtonWrapper,
  MobileImageWrapper,
  DesktopImageWrapper,
} from './styles'

function LinkRenderer(props) {
  return <a href={props.href} rel="noopener noreferrer" target="_blank">{props.children}</a>
}

interface Props extends ApiTypes.Messages.Message {
  isAuthor: boolean
  uploadLink: ApiTypes.UploadLink | null
  currentHub: CommonTypes.HubTypes.CurrentHub
  currentMessageLikes: ApiTypes.Messages.LikesInfoData | null
  isCommentsOpenByDeafult?: boolean

  onMessageEdit: (data: ApiTypes.Messages.EditMessage) => void
  onCommentPost: (data: ApiTypes.Messages.PostComment) => void
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => void
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => void
  onResetMessageUploadLink: () => void
  onLikeMessage: (data: ApiTypes.Messages.Like) => void
  getLikesForMessage: (data: ApiTypes.Messages.Like) => void
  callback?: () => void
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
  } = props

  const [isEditer, setEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)
  const [comment, onCommentChange] = useState<string>('')
  const [isCommentsOpen, openComments] = useState<boolean>(isCommentsOpenByDeafult || false)
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [isAttacmentDeleted, onAttachmentDelete] = useState<boolean>(false)
  const [isLikesInfoRequested, setLikesInfoRequest] = useState<boolean>(false)

  const commentEditorRef = useRef<HTMLTextAreaElement>(null)

  const onMessageSave = () => {

    let attachment_changed = (file?.size) ? true : false
    let attachment_id = file?.size ? uploadLink?.blob_id : ''

    if (isAttacmentDeleted) {
      attachment_changed = true
      attachment_id = ''
    }

    props.onMessageEdit({
      host: sourceHost,
      body: {
        message_id: id,
        text: message,
        text_changed: true,
        attachment_changed,
        attachment_id,
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
        onClick={() => {
          if (liked_by_me) {
            onLikeMessage({ host: sourceHost, id: id, unlike: true })
          } else {
            onLikeMessage({ host: sourceHost, id: id })
          }
        }}
        title={(isLikesInfoRequested) ? <CircularProgressStyled size={30} /> : <>{usersLikes || likesInfo}</>}
        interactive onOpen={() => getLikesInfo()}>
        <IconButton>
          <Badge badgeContent={likes} color="primary">
            {liked_by_me ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
    )

  }

  const onCommentSave = () => {
    openComments(true)
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

    if (isAttacmentDeleted) {
      return null
    }

    if (file?.size && file?.type.indexOf('image') !== -1) {
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
          <MobileImageWrapper>
            <TransformWrapper>
              <TransformComponent>
                <ImagePreview src={attachment}/>
              </TransformComponent>
            </TransformWrapper>
          </MobileImageWrapper>
          <DesktopImageWrapper>
            <ImagePreview src={attachment} />
          </DesktopImageWrapper>
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

  const renderReactions = () => {
    return (
      <ReactionsWrapper>
        {likes ?
          <LikesWrapper>
            {rendreLikeButton()}
            <LikesNamesList>
              {
                liked_by?.length && liked_by.map((item, counter) => {
                  return (counter === (liked_by.length - 1)) ? item.user_name : `${item.user_name}, `
                })
              }
            </LikesNamesList>
          </LikesWrapper> : <span />
        }
      </ReactionsWrapper>
    )
  }

  const renderReactionNav = () => {
    return (
      <ReactionNavWrapper>
        <ReactionNavItem onClick={() => {
          if (liked_by_me) {
            onLikeMessage({ host: sourceHost, id: id, unlike: true })
          } else {
            onLikeMessage({ host: sourceHost, id: id })
          }
        }}>
          {liked_by_me ? <FavoriteIcon color="inherit" /> : <FavoriteBorderIcon color="inherit" />}
          <ReactionNavText>Like</ReactionNavText>
        </ReactionNavItem>
        <ReactionNavItem onClick={onCommentClick}>
          <ReactionNavText>
            Comment
        </ReactionNavText>
        </ReactionNavItem>
      </ReactionNavWrapper>
    )
  }

  const onCommentClick = () => {
    openComments(true)
    commentEditorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    commentEditorRef?.current?.focus()
  }

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetMessageUploadLink } = props
    setUploadedFile(false)
    onAttachmentDelete(false)

    const uploadedFile = event.target.files
    if (uploadedFile && uploadedFile[0]) {
      onGetMessageUploadLink({
        host: props.currentHub.host,
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      })

      /* tslint:disable */
      loadImage(
        uploadedFile[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                setFile(newBlob)
              })
            }, 'image/jpeg')
          } else {
            setFile(uploadedFile[0])
          }
        },
        { meta: true, orientation: true, canvas: true }
      )
      /* tslint:enable */

    }
  }

  const onFileDelete = () => {
    onAttachmentDelete(true)
    setFile(null)
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

    callback && callback()

  }, [props, file, isFileUploaded, id, callback])

  const renderCommentsButton = () => {
    if (!comments?.length) return null

    return <CommentsLink
      onClick={() => openComments(!isCommentsOpen)}>
      {isCommentsOpen ? 'Hide' : 'View'} {comments.length} comments</CommentsLink>
  }

  return (
    <>
      <PaperStyled>
        <MessageHeader>
          <UserInfo>
            <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
              <Avatar src={getAvatarUrl(user_id)} />
            </AvatarWrapperLink>
            <UserNameWrapper>
              <UserNameLink to={`/profile/user?id=${user_id}`}>{user_name}</UserNameLink>
              <MessageDate>{moment(created_at).fromNow()}</MessageDate>
            </UserNameWrapper>
          </UserInfo>
          {isAuthor ? <AuthorButtonsMenu {...{ isEditer, setEditor, message, id, sourceHost }} /> :
            <NoAuthorButtonsMenu {...{ message, id, sourceHost }} />
          }
        </MessageHeader>
        {

          isEditer ?

            <EditorInMessageWrapper>
              <EditMessageField>
                <TextareaAutosizeStyled
                  onKeyDown={onComandEnterDownInMessage}
                  value={message}
                  onChange={(evant) => onMessageChange(evant.currentTarget.value)} />
                <IconButton onClick={onMessageSave}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </EditMessageField>
              <EditorButtonsWrapper>
                <Tooltip title={`Attach image or video`}>
                  <IconButtonWrapper>
                    <IconButton component="label">
                      <PhotoIcon fontSize="small" color="primary" />
                      <UploadInput
                        type="file"
                        id="file"
                        name="file"
                        onChange={onFileUpload}
                        accept="video/*,image/*"
                      />
                    </IconButton>
                  </IconButtonWrapper>
                </Tooltip>
                {(file || attachment_type) && <Tooltip title={`Delete attachment`}>
                  <IconButtonWrapper>
                    <IconButton component="label" onClick={onFileDelete}>
                      <LayersClearIcon fontSize="small" color="primary" />
                    </IconButton>
                  </IconButtonWrapper>
                </Tooltip>}
              </EditorButtonsWrapper>
            </EditorInMessageWrapper>

            : <MessageContent className="markdown-body">
              <ReactMarkdown renderers={{link: LinkRenderer}}>{message}</ReactMarkdown>
              <YoutubeFrame text={message}/>
            </MessageContent>
        }
        {renderAttachment()}
        {renderReactions()}
        {renderReactionNav()}
        {renderCommentsButton()}
        {mapComments()}
        <EditMessageWrapper>
          <EditMessageField>
            <TextareaAutosizeStyled
              ref={commentEditorRef}
              onKeyDown={onComandEnterDownInComment}
              value={comment}
              onChange={(evant) => onCommentChange(evant.currentTarget.value)} />
            <IconButton onClick={onCommentSave}>
              <SendIcon fontSize="small" />
            </IconButton>
          </EditMessageField>
        </EditMessageWrapper>
      </PaperStyled>
    </>
  )
}

type StateProps = Pick<Props, 'uploadLink' | 'currentHub' | 'currentMessageLikes'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  uploadLink: state.messages.uploadLink,
  currentHub: selectors.messages.currentHub(state),
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