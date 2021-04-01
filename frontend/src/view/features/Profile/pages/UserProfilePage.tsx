import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import { v4 as uuidv4 } from 'uuid'
import UserCoverBar from './../components/UserCoverBar'
import { getAvatarUrl, getProfileCoverUrl } from '@services/avatarUrl'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import queryString from 'query-string'
import ProfileFriend from '../components/ProfileFriend'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import { ProfileCommonFriend } from './../components/ProfileCommonFriend'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import ImageIcon from '@material-ui/icons/Image'
import {
  Container,
  PageCover,
  PageCoverWrapper,
  PageCoverIconWrapper,
  ProfileAvatar,
  LeftSideBar,
  ProfileRightSideBar,
  ProfileCentralBar,
  PageColumnBarsWrapper,
  PageBarTitle,
  ProfileName,
  ProfileNote,
} from '@view/shared/styles'
import {
  NoFriendsWrapper,
  NoFriendsTitle,
} from './../components/styles'

interface Props extends RouteComponentProps {
  users: ApiTypes.User[]
  friends: ApiTypes.Friends.Friend[] | null
  isUser: Boolean

  onGetFriends: () => void
  onGetFriendsOfFriendsRequest: () => void
  onGetUser: (value: string) => void
}

const UserProfilePage: React.FC<Props> = React.memo((props) => {
  const {
    onGetUser,
    isUser,
    users,
    friends,
    onGetFriends,
    onGetFriendsOfFriendsRequest,
    location,
  } = props

  const url = location.search
  const params = queryString.parse(url)
  const userId = params.id ? params.id : ''

  useEffect(() => {
    if (users[0]?.id !== userId) {
      onGetUser(userId as string)
      onGetFriends()
      onGetFriendsOfFriendsRequest()
    }
  }, [
    users,
    userId,
    friends,
  ])

  const setCurrentUserData = () => {
    const currentFriend = friends?.find(item => item.user.id === userId) || null
    
    if (currentFriend && users.length) {
      currentFriend.user = users[0]
    }

    return currentFriend
  }

  let profileUser: any = null
  if ( users.length > 0) {
    profileUser = users[0]
  }
  const currentUser = setCurrentUserData() 

  let commonFriends: ApiTypes.Friends.Friend[] = []

  if ( !isUser ){
    currentUser?.friends?.forEach(item => {
      if (friends?.some(myFriend => myFriend.user.id === item.user.id)) {
        commonFriends.push(item as never)
      }
    })
  }

  const mapFriendsList = () => {
    if ( isUser) {
      return friends?.map(item => {
        const { user, invite_status } = item

        return <ProfileFriend
          key={uuidv4()}
          fullName={user.full_name}
          name={user.name}
          id={user.id}
          inviteStatus={invite_status}
        />
      })
    } else if (currentUser?.friends?.length) {
      return currentUser.friends.map(item => {
        const { user, invite_status } = item

        return <ProfileFriend
          key={uuidv4()}
          fullName={user.full_name}
          name={user.name}
          id={user.id}
          inviteStatus={invite_status}
        />
      })
    } else {
      return (
        <>
          <NoFriendsWrapper>
            <PeopleAltIcon />
          </NoFriendsWrapper>
          <NoFriendsTitle>No friens yet</NoFriendsTitle>
        </>
      )
    }

  }

  const mapCommonFriendsList = () => {

    if (commonFriends.length) {
      return commonFriends.map(item => {
        const { user } = item

        return (
          <ProfileCommonFriend
            key={uuidv4()}
            name={user.name}
            fullName={user.full_name}
            id={user.id}
          />
        )
      })
    } else {
      return (
        <>
          <NoFriendsWrapper className="small-size">
            <PeopleAltIcon />
          </NoFriendsWrapper>
          <NoFriendsTitle className="small-size">No friens yet</NoFriendsTitle>
        </>
      )
    }
  }

  return (
    <>
      <PageCoverWrapper>
        <PageCoverIconWrapper>
          <ImageIcon/>
        </PageCoverIconWrapper>
        <PageCover resource={getProfileCoverUrl(userId as string)}/>
      </PageCoverWrapper>
      <UserCoverBar
        id={profileUser?.id}
        userName={profileUser?.name}
        inviteStatus={profileUser?.invite_status}
        groupCount={currentUser?.group_count}
        friendsLenght={currentUser?.friends?.length || 0}
        isUser={isUser? isUser : false}
        className="desktop-only"
      />
      <Container>
        <PageColumnBarsWrapper>
          <LeftSideBar>
            <ProfileAvatar src={getAvatarUrl(userId as string)} />
            <ProfileName>{profileUser?.full_name}</ProfileName>
            <ProfileNote>@{profileUser?.name}</ProfileNote>
            <UserCoverBar
              id={profileUser?.id}
              userName={profileUser?.name}
              groupCount={currentUser?.group_count}
              inviteStatus={profileUser?.invite_status}
              friendsLenght={currentUser?.friends?.length || 0}
              isUser={isUser? isUser : false}
              className="mobile-only"
            />
          </LeftSideBar>
          <ProfileCentralBar>
            <PageBarTitle>
              {isUser ? `My friends (${currentUser?.friends?.length || 0})` : `${capitalizeFirstLetter(profileUser?.name || '')}\`s friends (${currentUser?.friends?.length || 0})`}
            </PageBarTitle>
            {mapFriendsList()}
          </ProfileCentralBar>
          <ProfileRightSideBar className="empty">
          {!isUser && <><PageBarTitle>Common friends ({commonFriends.length || 0})</PageBarTitle>
            {mapCommonFriendsList()}
            </>
          }
          </ProfileRightSideBar>
        </PageColumnBarsWrapper>
      </Container>
    </>
  )
})

type StateProps = Pick<Props, 'users' | 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  users: selectors.profile.users(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onGetUser' | 'onGetFriends' | 'onGetFriendsOfFriendsRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onGetFriendsOfFriendsRequest: () => dispatch(Actions.friends.getFriendsOfFriendsRequest()),
  onGetUser: (value: string) => dispatch(Actions.profile.getUsersRequest([value])),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfilePage))
