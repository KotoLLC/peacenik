import React, { useState, useEffect } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveCommentDialog from './RemoveCommentDialog'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import SendIcon from '@material-ui/icons/Send'
import {
  CommentWrapper,
  UserName,
  CommentReactionsNav,
  CommentTextWrapper,
  AvatarStyled,
  TextareaAutosizeStyled,
  EditMessageField,
  ButtonsWrapper,
  CircularProgressStyled,
  CommentContent,
  CommentReactionsNavWrapper,
  LikeCommentButton,
} from './styles'
import { ApiTypes, StoreTypes } from 'src/types'

// @ts-ignore
const userHubUrl: string = window.apiEndpoint

interface Props extends ApiTypes.Messages.Comment {
  userId: string
  currentCommentLikes: ApiTypes.Messages.LikesInfoData | null

  onCommentEdit: (data: ApiTypes.Messages.EditComment) => void
  onCommentDelete: (data: ApiTypes.Messages.DeleteComment) => void
  onLikeComment: (data: ApiTypes.Messages.Like) => void
  getLikesForComment: (data: ApiTypes.Messages.Like) => void
}

const Comment: React.SFC<Props> = (props) => {
  const {
    text,
    user_name,
    created_at,
    id,
    user_id,
    sourceHost,
    userId,
    likes,
    onLikeComment,
    currentCommentLikes,
    getLikesForComment,
  } = props
  const [isEditer, setEditor] = useState<boolean>(false)
  const [comment, onCommentChange] = useState<string>(text)
  const commentRef = React.createRef<HTMLDivElement>()
  const [isLikesInfoRequested, setLikesInfoRequest] = useState<boolean>(false)

  useEffect(() => {
    if (props.currentCommentLikes?.id === id) {
      setLikesInfoRequest(false)
    }
  }, [props.currentCommentLikes, id])

  const onMessageSave = () => {
    setEditor(false)
    props.onCommentEdit({
      host: sourceHost,
      body: {
        comment_id: id,
        text: comment,
        text_changed: true, 
      }
    })
  }

  const onComandEnterDown = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSave()
    }
  }

  const getLikesInfo = () => {
    if (currentCommentLikes?.id === id) {
      setLikesInfoRequest(false)  
    }

    if (currentCommentLikes?.id !== id) {
      setLikesInfoRequest(true)
      getLikesForComment({
        host: sourceHost, 
        id: id
      })
    }
  }

  const rendreLikeButton = () => {
    let likesInfo = 'No likes yet'
    let usersLikes = ''

    if (currentCommentLikes?.id === id) {
      currentCommentLikes.likes.length && currentCommentLikes.likes.forEach((item, counter) => {
        
        if (counter < 15) {
          const comma = ((currentCommentLikes.likes.length - 1) === counter) ? '' : ', '
          usersLikes += `${item.user_name}${comma}`
        } 

        if (counter === 15) {
          usersLikes += `...`
        }
        
      })
    }

    return (
      <Tooltip 
        onClick={() => onLikeComment({ host: sourceHost, id: id })}
        title={(isLikesInfoRequested) ? <CircularProgressStyled size={30}/> : <>{usersLikes || likesInfo}</>} 
        interactive onOpen={() => getLikesInfo()}>
        <LikeCommentButton>{likes} like</LikeCommentButton>
      </Tooltip>
    )
    
  }

  const renderCurrentIcons = () => {
    if (userId === user_id) {
      return (
        <ButtonsWrapper>
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <RemoveCommentDialog {...{ comment, id, sourceHost }} />
        </ButtonsWrapper>
      )
    } else return null
  }

  return (
    <CommentWrapper ref={commentRef}>
      <AvatarStyled src={`${userHubUrl}/image/avatar/${user_id}`} />
      <CommentTextWrapper>{
         isEditer ?
          <EditMessageField>
            <TextareaAutosizeStyled
              onKeyDown={onComandEnterDown}
              value={comment}
              onChange={(evant) => onCommentChange(evant.currentTarget.value)} />
            <IconButton onClick={onMessageSave}>
              <SendIcon fontSize="small" />
            </IconButton>
          </EditMessageField> 
          : 
          <CommentContent>
            <UserName>{user_name}</UserName> {comment}
          </CommentContent>
      }
      <CommentReactionsNavWrapper> 
        <CommentReactionsNav>{rendreLikeButton()}</CommentReactionsNav>
        <CommentReactionsNav>{moment(created_at).fromNow()}</CommentReactionsNav>
      </CommentReactionsNavWrapper>
      </CommentTextWrapper>
      {renderCurrentIcons()}
    </CommentWrapper>
  )
}

type StateProps = Pick<Props, 'userId' | 'currentCommentLikes'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
  currentCommentLikes: selectors.messages.currentCommentLikes(state),
})

type DispatchProps = Pick<Props, 'onCommentEdit' | 'onCommentDelete' | 'onLikeComment' | 'getLikesForComment'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onCommentEdit: (data: ApiTypes.Messages.EditComment) => dispatch(Actions.messages.editCommentRequest(data)),
  onCommentDelete: (data: ApiTypes.Messages.DeleteComment) => dispatch(Actions.messages.deleteCommentRequest(data)),
  onLikeComment: (data: ApiTypes.Messages.Like) => dispatch(Actions.messages.linkCommnetRequest(data)),
  getLikesForComment: (data: ApiTypes.Messages.Like) => dispatch(Actions.messages.getLikesForCommentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Comment)