import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { getAvatarUrl } from '@services/avatarUrl'

import {
  ContactAvatarStyled,
  MessageCard,
  MessageCardContent,
  MessageInfoBlock,
  MessageInfoDisplayName,
  MessageInfoHeader,
  MessageInfoLastAccessTime,
} from '@view/features/Messages/components/styles'

// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
// import DonutLargeIcon from '@material-ui/icons/DonutLarge'
// import DoneIcon from '@material-ui/icons/Done'
// import DoneAllIcon from '@material-ui/icons/DoneAll'
// import * as Types from '../../../../../types/enum'
import { dateToRelateString } from '@services/dateToRelateString'

interface Props {
  userId: string
  accessTime: string
  fullName: string
  location: any
}

const DirectMessageListItem: React.FC<Props> = ({
  fullName,
  userId,
  accessTime,
  location
}) => {
  const baseURL = useRouteMatch().path

  const getLastMessageTime = () => {
    return dateToRelateString(accessTime)
  }

  let pathName = ""
  if (location.pathname?.indexOf("messages/d/") > -1) {
    pathName = location.pathname?.substring(location.pathname?.lastIndexOf('/') + 1)
  }

  // const renderOutgoingSwitch = useCallback(
  //   (status: Types.MessagePublishStatus | undefined) => {
  //     switch (status) {
  //       case Types.MessagePublishStatus.PENDING_STATUS:
  //         return <DonutLargeIcon />
  //       case Types.MessagePublishStatus.ACCEPTED_STATUS:
  //         return <DoneIcon />
  //       case Types.MessagePublishStatus.READ_STATUS:
  //         return <DoneAllIcon style={{ color: '#599C0B' }} />
  //       case Types.MessagePublishStatus.NOT_SENT_STATUS:
  //       case Types.MessagePublishStatus.UNKNOWN_STATUS:
  //     }
  //     return <InfoOutlinedIcon />
  //   },
  //   []
  // )

  return (
    <Link to={`${baseURL}/${userId}`} >
      <MessageCard className={(pathName === userId) ? "active" : ""}>
        <MessageCardContent>
          <ContactAvatarStyled alt={fullName} src={getAvatarUrl(userId)} />
          <MessageInfoBlock>
            <MessageInfoHeader>
              <MessageInfoDisplayName>{fullName}</MessageInfoDisplayName>
              <MessageInfoLastAccessTime>
                {getLastMessageTime()}
              </MessageInfoLastAccessTime>
            </MessageInfoHeader>
          </MessageInfoBlock>
        </MessageCardContent>
      </MessageCard>
    </Link>
  )
}

export default DirectMessageListItem
