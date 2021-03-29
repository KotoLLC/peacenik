import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ApiTypes, StoreTypes } from 'src/types'
import IconButton from '@material-ui/core/IconButton'
import selectors from '@selectors/index'
import {
  ReactionNavItem,
} from './styles'
import CommentDialog from './CommentDialog'

interface Props extends ApiTypes.Feed.Comment {
  userId: string
}

const FeedComment = (props) => {
  const {
    user_id,
    created_at,
    message,
    isAttacmentDeleted,
    attachment_type,
    attachment,
    comments,
    sourceHost,
    friends,
    messageToken,
    id,
    userId,
    notifyClicked
  } = props
  const [isOpen, setOpen] = useState(false)
  React.useEffect(() => {
    setOpen(notifyClicked)
  }, [notifyClicked])

  const checkIsCommentedByMe = (): boolean => {
    return comments.some(item => item?.user_id === userId)
  }

  return (
    <>
      <ReactionNavItem onClick={() => setOpen(true)} >
        <IconButton>
          {
            checkIsCommentedByMe() ?
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47687 2 2 5.91813 2 10.75C2 13.5119 3.46563 15.9706 5.75 17.5744V22L10.1306 19.3419C10.7369 19.4419 11.3606 19.5 12 19.5C17.5225 19.5 22 15.5825 22 10.75C22 5.91813 17.5225 2 12 2Z" fill="#599C0B" />
              </svg> :
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 17.5744V17.3145L6.03729 17.1652C3.86562 15.6405 2.5 13.3253 2.5 10.75C2.5 6.25486 6.68825 2.5 12 2.5C17.3111 2.5 21.5 6.25488 21.5 10.75C21.5 15.2457 17.3112 19 12 19C11.391 19 10.7946 18.9446 10.212 18.8485L10.0294 18.8184L9.87125 18.9144L6.25 21.1118V17.5744Z" stroke="#A1AEC8" />
              </svg>
          }
        </IconButton>
      </ReactionNavItem>
      <CommentDialog isOpen={isOpen} setOpen={setOpen} created_at={created_at} message={message} isAttacmentDeleted={isAttacmentDeleted} attachment_type={attachment_type} attachment={attachment} comments={comments} sourceHost={sourceHost} messageToken={messageToken} id={id} user_id={user_id} friends={friends}/>
    </>
  )
}

type StateProps = Pick<Props, 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(FeedComment)