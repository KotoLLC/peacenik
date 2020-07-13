import React, { useEffect } from 'react'
import { ContainerStyled } from './styles'
import { Editor } from './Editor'
import { Message } from './Message'
import { connect } from 'react-redux'
import Actions from '@store/actions'

interface Props {
  onGetMessages: () => void
  onGetCurrentToken: () => void
}

const MessageFeed: React.SFC<Props> = (props) => {

  useEffect(() => {
    props.onGetMessages()
    props.onGetCurrentToken()
  })

  return (
    <ContainerStyled maxWidth="md">
      <Message />
      <Editor />
    </ContainerStyled>
  )
}

type DispatchProps = Pick<Props, 'onGetMessages' | 'onGetCurrentToken'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetMessages: () => dispatch(Actions.messages.getMessagesRequest()),
  onGetCurrentToken: () => dispatch(Actions.messages.getCurrentTokenRequest()),
})

export default connect(null, mapDispatchToProps)(MessageFeed)