import React from 'react'
import { ContainerStyled } from './styles'
import { CreateMessage } from './CreateMessage'

export class Messages extends React.Component {

  render() {
    return (
      <ContainerStyled maxWidth="md">
        <CreateMessage/>
      </ContainerStyled>
    )
  }
}