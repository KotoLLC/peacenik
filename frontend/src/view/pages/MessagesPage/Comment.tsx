import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveMessageDialog from './RemoveMessageDialog'
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
}

const Comment: React.SFC<Props> = (props) => {
  const { text, user_name, created_at, id, user_id, sourceHost, userId } = props
  const [isEditer, setEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)

  const onMessageSave = () => {
    setEditor(false)
    // props.onMessageEdit({
    //   host: sourceHost,
    //   body: {
    //     message_id: id,
    //     text: message,
    //   }
    // })
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
          {/* <RemoveMessageDialog {...{ message, id, sourceHost }} /> */}
        </ButtonsWrapper>
      )
    }
  }

  return (
    <CommentWrapper>
      <MessageHeader>
        <UserInfo>
          <Avatar variant="rounded" />
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
    </CommentWrapper>
  )
}

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

// type DispatchProps = Pick<Props, ''>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
//   onCommentEdit: (data: ApiTypes.Messages.EditMessage) => dispatch(Actions.messages.editMessageRequest(data)),
// })

export default connect(mapStateToProps, {})(Comment)