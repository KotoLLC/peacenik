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
} from './styles'

export const CreateMessage = () => {
  const [value, onValueChange] = useState<string>('')

  return (
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
  )
}