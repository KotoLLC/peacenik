import React from 'react'

export const LinkRenderer = (props) => {
  return <a href={props.href} target="_blank">{props.children}</a>
}