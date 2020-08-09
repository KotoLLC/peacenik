import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveCommentDialog from './RemoveCommentDialog'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import Badge from '@material-ui/core/Badge'
import {
  CommentWrapper,
  MessageHeader,
  UserInfo,
  UserName,
  MessageDate,
  UserNameWrapper,
  MessageContent,
  TextareaAutosizeStyled,
  EditMessageWrapper,
  ButtonSend,
  ButtonsWrapper,
  CircularProgressStyled,
} from './styles'
import { ApiTypes, StoreTypes } from 'src/types'

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
    avatar_thumbnail,
    liked_by_me,
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
        <IconButton>
          <Badge badgeContent={likes} color="primary">
            {liked_by_me ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
    )
    
  }

  const renderCurrentIcons = () => {
    if (userId === user_id) {
      return (
        <ButtonsWrapper>
          {rendreLikeButton()}
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <RemoveCommentDialog {...{ comment, id, sourceHost }} />
        </ButtonsWrapper>
      )
    } else {
      return (
        <ButtonsWrapper>
          {rendreLikeButton()}
        </ButtonsWrapper>
      )
    }
  }

  return (
    <CommentWrapper ref={commentRef}>
      <MessageHeader>
        <UserInfo>
          <Avatar variant="rounded" src={avatar_thumbnail} />
          <UserNameWrapper>
            <UserName>{user_name}</UserName>
            <MessageDate>{moment(created_at).fromNow()}</MessageDate>
          </UserNameWrapper>
        </UserInfo>
        {renderCurrentIcons()}
      </MessageHeader>
      {
        isEditer ?
          <EditMessageWrapper>
            <TextareaAutosizeStyled
              onKeyDown={onComandEnterDown}
              value={comment}
              onChange={(evant) => onCommentChange(evant.currentTarget.value)} />
            <ButtonSend
              variant="contained"
              color="primary"
              onClick={onMessageSave}
            >Save</ButtonSend>
          </EditMessageWrapper>
          : <MessageContent>{comment}</MessageContent>
      }
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