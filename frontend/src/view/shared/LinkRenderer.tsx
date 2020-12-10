import React from 'react'
import { MentionLink } from './styles'

export const LinkRenderer = (props) => {
  if (props.href.indexOf('/profile/user?') !== -1) {
    return <MentionLink className="mention" to={props.href}>{props.children}</MentionLink>
  } else {
    return <a href={props.href} rel="noopener noreferrer" target="_blank">{props.children}</a>
  }
}