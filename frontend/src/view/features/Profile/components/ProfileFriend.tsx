import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAvatarUrl } from '@services/avatarUrl'
import { ApiTypes, StoreTypes } from 'src/types'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import {
  UsersListItemWrapper,
  UsersListItemAvatar,
  UsersListItemFullName,
  UsersListItemName,
  UsersListItemNamesWrapper,
  ProfileFriendItemName,
  ProfileFriendItemFullName,
  ButtonContained,
  UsersListItemButtons,
  CircularProgressWhite,
} from '@view/shared/styles'

interface Props {
  fullName: string
  name: string
  id: string
  inviteStatus: ApiTypes.Friends.InvitationStatus
  friends: ApiTypes.Friends.Friend[] | null

  onAddFriend: (data: ApiTypes.Friends.Request) => void
}

const ProfileFriend: React.FC<Props> = React.memo((props) => {
  const {
    fullName,
    name,
    id,
    inviteStatus,
    onAddFriend,
    friends,
  } = props
  const [isRequest, setRequest] = useState<boolean>(false)

  let bLinkable: Boolean = (friends?.some(item => item.user.id === id)) || (inviteStatus === 'accepted') || (inviteStatus === 'pending')

  const checkCurrentButton = () => {

    if (friends?.some(item => item.user.id === id)) {
      return null
    }

    if (inviteStatus === 'accepted') return null

    if (inviteStatus === 'pending') return (
      <ButtonContained className="grey" disabled>Request sent</ButtonContained>
    )

    return <ButtonContained onClick={onButtonClick}>
      {isRequest ? <CircularProgressWhite size={20} /> : 'Add friend'}
    </ButtonContained>
  }

  useEffect(() => {
    setRequest(false)
  }, [props])

  const onButtonClick = () => {
    setRequest(true)
    onAddFriend({ friend: id })
  }

  return (
    <UsersListItemWrapper>
      {bLinkable && <Link to={`/profile/user?id=${id}`}>
        <UsersListItemAvatar src={getAvatarUrl(id)} />
      </Link>}
      {!bLinkable && <UsersListItemAvatar src={getAvatarUrl(id)} />}
      <UsersListItemNamesWrapper>
        {bLinkable && <>
          {fullName && <UsersListItemFullName to={`/profile/user?id=${id}`}>{fullName}</UsersListItemFullName>}
          <UsersListItemName to={`/profile/user?id=${id}`}>@{name}</UsersListItemName>
        </>}
        {!bLinkable && <>
          <ProfileFriendItemName>{fullName}</ProfileFriendItemName>
          <ProfileFriendItemFullName>@{name}</ProfileFriendItemFullName>
        </>}
      </UsersListItemNamesWrapper>
      <UsersListItemButtons>
        {checkCurrentButton()}
      </UsersListItemButtons>
    </UsersListItemWrapper>
  )
})

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onAddFriend'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAddFriend: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFriend)