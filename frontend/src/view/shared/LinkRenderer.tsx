import React from 'react'

export const LinkRenderer = (props) => {
  return <a href={props.href} rel="noopener noreferrer" target="_blank">{props.children}</a>
}