import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveMessageDialog from './RemoveMessageDialog'
import moment from 'moment'
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
} from './styles'
import { ApiTypes } from './../../../types'

interface Props extends ApiTypes.Messages.Message {
  isAuthor: boolean
}

export const Message: React.SFC<Props> = (props) => {
  const { text, user_name, created_at, isAuthor } = props
  const [isEditer, setEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>(text)

  return (
    <PaperStyled>
      <MessageHeader>
        <UserInfo>
          <Avatar variant="rounded" />
          <UserNameWrapper>
            <UserName>{user_name}</UserName>
            <MessageDate>{moment(created_at).fromNow()}</MessageDate>
          </UserNameWrapper>
        </UserInfo>
        {isAuthor && <ButtonsWrapper>
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)} color="inherit">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <RemoveMessageDialog message={message} />
        </ButtonsWrapper>}
      </MessageHeader>
      {
        isEditer ?
          <EditMessageWrapper>
            <TextareaAutosizeStyled value={message} onChange={(evant) => onMessageChange(evant.currentTarget.value)} />
            <ButtonSend
              variant="contained"
              color="primary"
              onClick={() => setEditor(false)}
            >Save</ButtonSend>
          </EditMessageWrapper>
          : <MessageContent>{message}</MessageContent>
      }

    </PaperStyled>
  )
}