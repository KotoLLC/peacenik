import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import SendIcon from '@material-ui/icons/Send'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes, NodeTypes } from './../../../types'
import selectors from '@selectors/index'

import {
  TextareaAutosizeStyled,
  ButtonSend,
  TextareaTitle,
  CreateWrapper,
  PaperStyled,
  EditorWrapper,
  MessageSticky,
} from './styles'

interface Props {
  authToken: string
  currentNode: NodeTypes.CurrentNode
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => void
}

const Editor: React.SFC<Props> = (props) => {
  const [value, onValueChange] = useState<string>('')

  const onMessageSend = () => {
    if (!value) return

    const data = {
      host: props.currentNode.host,
      body: {
        token: props.currentNode.token,
        text: value,
      }
    }

    props.onMessagePost(data)
  }

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
              onClick={onMessageSend}
              endIcon={<SendIcon />}
            >Send</ButtonSend>
          </EditorWrapper>
        </CreateWrapper>
      </PaperStyled>
    </MessageSticky>
  )
}

type StateProps = Pick<Props, 'authToken' | 'currentNode'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  authToken: state.authorization.authToken,
  currentNode: selectors.messages.currentNode(state),
})

type DispatchProps = Pick<Props, 'onMessagePost'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => dispatch(Actions.messages.postMessageRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)