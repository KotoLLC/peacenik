import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveCommentDialog from './RemoveCommentDialog'
import moment from 'moment'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import {
  CommentWrapper,
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
} from './styles'
import { ApiTypes, StoreTypes } from '../../../types'

interface Props extends ApiTypes.Messages.Comment {
  userId: string
  onCommentEdit: (data: ApiTypes.Messages.EditComment) => void
  onCommentDelete: (data: ApiTypes.Messages.DeleteComment) => void
}

const Comment: React.SFC<Props> = (props) => {
  const { text, user_name, created_at, id, user_id, sourceHost, userId, avatar_thumbnail } = props
  const [isEditer, setEditor] = useState<boolean>(false)
  const [comment, onCommentChange] = useState<string>(text)
  const commentRef = React.createRef<HTMLDivElement>()

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
    }
  }

  return (
    <CommentWrapper ref={commentRef}>
      <MessageHeader>
        <UserInfo>
          <Avatar variant="rounded" src={avatar_thumbnail}/>
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

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onCommentEdit' | 'onCommentDelete'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onCommentEdit: (data: ApiTypes.Messages.EditComment) => dispatch(Actions.messages.editCommentRequest(data)),
  onCommentDelete: (data: ApiTypes.Messages.DeleteComment) => dispatch(Actions.messages.deleteCommentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Comment)