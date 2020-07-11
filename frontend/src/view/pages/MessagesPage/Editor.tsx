import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import SendIcon from '@material-ui/icons/Send'

import {
  TextareaAutosizeStyled,
  ButtonSend,
  TextareaTitle,
  CreateWrapper,
  PaperStyled,
  EditorWrapper,
  MessageSticky,
} from './styles'

export const Editor = () => {
  const [value, onValueChange] = useState<string>('')

  return (
    <MessageSticky>
      <PaperStyled>
        <CreateWrapper>
          <Avatar variant="rounded" />
          <EditorWrapper>
            <TextareaTitle className={value.length ? 'active' : ''}>Post a message to your friend</TextareaTitle>
            <TextareaAutosizeStyled value={value} onChange={(evant) => onValueChange(evant.currentTarget.value)} />
            <ButtonSend
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
            >Send</ButtonSend>
          </EditorWrapper>
        </CreateWrapper>
      </PaperStyled>
    </MessageSticky>
  )
}