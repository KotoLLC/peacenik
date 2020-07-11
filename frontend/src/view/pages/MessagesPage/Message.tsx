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

export const Message = () => {
  const [isEditer, setEditor] = useState<boolean>(false)
  const [message, onMessageChange] = useState<string>('Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur consequatur quis saepe numquam! Voluptates fugit rerum nisi impedit deserunt quae quam tempora dolorum, ipsam modi ut animi optio quo quibusdam quos est enim facere? Natus ratione, dolorem ipsa doloremque harum, exercitationem, beatae ea accusantium incidunt consequatur magnam hic veniam. Quas?')

  return (
    <PaperStyled>
      <MessageHeader>
        <UserInfo>
          <Avatar variant="rounded" />
          <UserNameWrapper>
            <UserName>User Name</UserName>
            <MessageDate>{moment('2020-07-11').fromNow()}</MessageDate>
          </UserNameWrapper>
        </UserInfo>
        <ButtonsWrapper>
          <Tooltip title={`Edit`}>
            <IconButton onClick={() => setEditor(!isEditer)} color="inherit">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <RemoveMessageDialog message={message}/>
        </ButtonsWrapper>
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