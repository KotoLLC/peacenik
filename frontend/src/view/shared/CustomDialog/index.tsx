import React from 'react'
import {
  Viewport, 
  DialogWrapper,
 } from './styles'

interface Props {}

export const CustomDialog: React.FC<Props> = (props) => {
  return (
    <>
      <Viewport />
      <DialogWrapper>
        {props.children}
      </DialogWrapper>
    </>
  )
}