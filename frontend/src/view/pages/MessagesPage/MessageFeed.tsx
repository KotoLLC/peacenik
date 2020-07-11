import React from 'react'
import { ContainerStyled } from './styles'
import { Editor } from './Editor'
import { Message } from './Message'

export class MessageFeed extends React.Component {

  render() {
    return (
      <ContainerStyled maxWidth="md">
        <Message/>
        <Editor/>
      </ContainerStyled>
    )
  }
}