import React from 'react'
import Comment from '@assets/images/comment-icon.svg'
import { ApiTypes } from 'src/types'
import moment from 'moment'
import {
  NotificationWrapper,
  AvatarStyled,
  IconBackground,
  AddIconStyled,
  NotifyBlock,
  NotifyText,
  NotifyName,
  NotifyContent,
  AvatarBlock,
  // ImagePreviewBlock,
  LikeIconStyled,
  CommentIconStyled,
  StorageIconStyled,
} from './styles'
import { 
  TimeBlock,
  AccessTimeIconStyled 
} from '@view/shared/styles'

interface Props extends ApiTypes.Notifications.Notification {
  onClick?: () => void
}

export const Notification: React.FC<Props> = (props) => {

  const {
    read_at,
    text,
    type,
    data,
    created_at,
    sourceHost,
    messageToken,
    onClick,
  } = props

  let urlVars = `?type=${type}`
  const dataObj = JSON.parse(data as any) // tslint:disable-line

  dataObj.messageToken = messageToken
  dataObj.sourceHost = sourceHost

  Object.entries(dataObj).forEach(
    ([key, value]) => {
      urlVars += `&${key}=${value}`
    }
  )

  const renderCorrectIcon = () => {
    if (type.indexOf('message-hub') !== -1) {
      return (
        <IconBackground color="#000">
          <StorageIconStyled />
        </IconBackground>
      )
    }

    if (type.indexOf('message') !== -1) {
      return (type === 'message/like') ? (
        <IconBackground color="#FF0000">
          <LikeIconStyled />
        </IconBackground>
      ) : (
        <IconBackground color="#03A9F4">
          <CommentIconStyled alt="" src={Comment} />
        </IconBackground>
      )
    }

    if (type.indexOf('comment') !== -1) {
      return (type === 'comment/like') ? (
        <IconBackground color="#FF0000">
          <LikeIconStyled />
        </IconBackground>
      ) : (
        <IconBackground color="#03A9F4">
          <CommentIconStyled alt="" src={Comment} />
        </IconBackground>
      )
    }

    if (type.indexOf('invite') !== -1) {
      return (
        <IconBackground color="#599C0B">
          <AddIconStyled />
        </IconBackground>
      )
    }

    return null
  }

  const renderCorrectPath = () => {
    if (type.indexOf('message-hub') !== -1) {
      return `/settings/hub`
    }

    if (type.indexOf('message') !== -1) {
      return `/feed/info${urlVars}`
    }

    if (type.indexOf('comment') !== -1) {
      return `/feed/info${urlVars}`
    }

    if (type.indexOf('like') !== -1) {
      return `/feed/info${urlVars}`
    }

    if (type.indexOf('invite') !== -1) {
      if (type.indexOf('group-invite') !== -1) {
        return '/groups'
      }

      if (type.indexOf('friend-invite') !== -1) {
        return '/friends/all'
      }
    }

    return ''
  }

  return (
    <NotificationWrapper onClick={onClick} to={renderCorrectPath()} className={Boolean(read_at) ? 'read' : ''}>
      <AvatarBlock>
        <AvatarStyled src="" />
        {renderCorrectIcon()}
      </AvatarBlock>
      <NotifyBlock>
        <NotifyText>
          <NotifyContent>
            <NotifyName>{text}</NotifyName>
            {/* <span>{act}</span> */}
            {/* {text} */}
          </NotifyContent>
        </NotifyText>
        {/* <ImagePreviewBlock>
            <img alt={preview} src={preview} />
          </ImagePreviewBlock> */}
        <TimeBlock>
          {moment(created_at).fromNow()}
          <AccessTimeIconStyled />
        </TimeBlock>
      </NotifyBlock>
    </NotificationWrapper>
  )
}
