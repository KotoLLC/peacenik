import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import Actions from '@store/actions'
import { getAvatarUrl } from '@services/avatarUrl'
import queryString from 'query-string'
import { history } from '@view/routes'
import DisableUserDialog from '@view/shared/DisableUserDialog'
import RemoveFriendDialog from './RemoveFriendDialog'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'

import {
  UserName,
  AvatarStyled,
  ListStyled,
  ContainerTitle,
} from '@view/pages/FriendsPage/styles'
import {
  UserContentWrapper,
  AvatarWrapper,
  FormWrapper,
  AvatarLabel,
  ProfileWrapper,
  Header,
  Title,
  UsersWrapper,
} from './styles'

interface Props {
  userName: string
  users: ApiTypes.User[]
  friends: ApiTypes.Friends.Friend[]

  onGetFriends: () => void
  onAddFriend: (data: ApiTypes.Friends.Request) => void
  onGetUser: (value: string) => void
}

const UserProfile: React.FC<Props> = (props) => {
  const { userName, onGetUser, users, friends, onGetFriends, onAddFriend } = props
  const url = history.location.search
  const params = queryString.parse(url)
  const userId = params.id ? params.id : ''

  useEffect(() => {
    onGetUser(userId as string)
    onGetFriends()
  }, [props, users, onGetUser, userId, friends])

  const checkCurrentIcon = (user: ApiTypes.User, status: ApiTypes.Friends.InvitationStatus) => {

    if (friends.some(item => item.user.id === user.id)) {
      return null
    }

    if (status === 'accepted') return null

    if (status === 'pending') return (
      <Tooltip title={`Wait for a reply`}>
        <IconButton color="primary">
          <AccessTimeIcon />
        </IconButton>
      </Tooltip>
    )

    if (status === 'rejected') {
      return (
        <Tooltip title={`Add ${capitalizeFirstLetter(user.name)} to friends`}>
          <IconButton color="primary" onClick={() => onAddFriend({ friend: user.id })}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title={`Add ${capitalizeFirstLetter(user.name)} to friends`}>
          <IconButton color="primary" onClick={() => onAddFriend({ friend: user.id })}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      )
    }
  }

  const mapPotentialFriendsList = (id: string) => {
    const selectedFriend = friends.find(item => item.user.id === id) || null

    if (!selectedFriend) return null

    return selectedFriend.friends.map(item => {
      const { user, invite_status } = item

      return (
        <div key={user.id}>
          <ListItem>
            <ListItemAvatar>
              <AvatarStyled className="no-link" alt={user.name} src={getAvatarUrl(user.id)} />
            </ListItemAvatar>
            <ListItemText primary={<UserName className="no-link">{user.name}</UserName>} />
            {checkCurrentIcon(user, invite_status)}
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    })
  }

  return (
    <>
      <ProfileWrapper>
        <Header>
          <Title>{(users[0]?.name) ? capitalizeFirstLetter(users[0]?.name) : ''}</Title>
        </Header>
        <UserContentWrapper>
          <AvatarWrapper>
            <AvatarLabel className="no-link">
              <img src={getAvatarUrl(userId as string)} alt={userName} />
            </AvatarLabel>
          </AvatarWrapper>
          <FormWrapper>
            <RemoveFriendDialog userId={userId as string} userName={users[0]?.name} />
            <DisableUserDialog userId={userId as string} />
          </FormWrapper>
        </UserContentWrapper>
      </ProfileWrapper>
      <ProfileWrapper>
        <UsersWrapper>
          <ListStyled className="resize">
            <ContainerTitle>{`${users[0]?.name}\`s friends`}</ContainerTitle>
            {mapPotentialFriendsList(userId as string)}
          </ListStyled>
        </UsersWrapper>
      </ProfileWrapper>
    </>
  )
}

type StateProps = Pick<Props, 'userName' | 'users' | 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  users: selectors.profile.users(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onGetUser' | 'onAddFriend' | 'onGetFriends'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onGetUser: (value: string) => dispatch(Actions.profile.getUsersRequest([value])),
  onAddFriend: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)