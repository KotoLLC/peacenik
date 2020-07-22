import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
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
  isMessagePostedSuccess: boolean
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => void
  onPostMessageSucces: (value: boolean) => void
}

const Editor: React.SFC<Props> = (props) => {
  const [value, onValueChange] = useState<string>('')
  const { isMessagePostedSuccess, onPostMessageSucces } = props

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

  const onComandEnterDown = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSend()
    }
  }

  useEffect(() => {
    if (isMessagePostedSuccess) {
      onValueChange('')
    }
    onPostMessageSucces(false)
  }, [isMessagePostedSuccess, onPostMessageSucces])

  return (
    <MessageSticky>
      <PaperStyled>
        <CreateWrapper>
          <Avatar variant="rounded" />
          <EditorWrapper>
            <TextareaTitle className={value.length ? 'active' : ''}>Post a message to your friend</TextareaTitle>
            <TextareaAutosizeStyled 
              value={value} 
              onKeyDown={onComandEnterDown}
              onChange={(evant) => onValueChange(evant.currentTarget.value)} />
            <ButtonSend
              variant="contained"
              color="primary"
              onClick={onMessageSend}
            >Post</ButtonSend>
          </EditorWrapper>
        </CreateWrapper>
      </PaperStyled>
    </MessageSticky>
  )
}

type StateProps = Pick<Props, 'authToken' | 'currentNode' | 'isMessagePostedSuccess'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  authToken: state.authorization.authToken,
  currentNode: selectors.messages.currentNode(state),
  isMessagePostedSuccess: selectors.messages.isMessagePostedSuccess(state),
})

type DispatchProps = Pick<Props, 'onMessagePost' | 'onPostMessageSucces'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => dispatch(Actions.messages.postMessageRequest(data)),
  onPostMessageSucces: (value: boolean) => dispatch(Actions.messages.postMessageSucces(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)