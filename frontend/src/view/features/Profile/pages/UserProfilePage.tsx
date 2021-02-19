import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import { v4 as uuidv4 } from 'uuid'
import UserCoverBar from './../components/UserCoverBar'
import { getGroupAvatarUrl, getGroupCoverUrl, getAvatarUrl } from '@services/avatarUrl'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import queryString from 'query-string'
import ProfileFriend from '../components/ProfileFriend'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import { ProfileCommonFriend } from './../components/ProfileCommonFriend'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import {
  Container,
  PageCover,
  ProfileAvatar,
  LeftSideBar,
  RightSideBar,
  CentralBar,
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
  userName: string
  users: ApiTypes.User[]
  friends: ApiTypes.Friends.Friend[] | null

  onGetFriends: () => void
  onAddFriend: (data: ApiTypes.Friends.Request) => void
  onGetUser: (value: string) => void
}

const UserProfilePage: React.FC<Props> = React.memo((props) => {
  const {
    userName,
    onGetUser,
    users,
    friends,
    onGetFriends,
    onAddFriend,
    location,
  } = props
  const [friendsLength, setFriendsLength] = useState<number>(0)

  const url = location.search
  const params = queryString.parse(url)
  const userId = params.id ? params.id : ''

  useEffect(() => {
    onGetUser(userId as string)
    onGetFriends()
  }, [
    props,
    users,
    onGetUser,
    userId,
    friends,
    onGetFriends,
    friendsLength,
  ])

  const selectedFriend = friends?.find(item => item.user.id === userId) || null

  let commonFriends: ApiTypes.Friends.Friend[] = []

  selectedFriend?.friends?.forEach(item => {
    if (friends?.some(myFriend => myFriend.user.id === item.user.id)) {
      commonFriends.push(item as never)
    }
  })

  const mapFriendsList = () => {
    if (selectedFriend === null) return null

    if (selectedFriend?.friends?.length) {
      return selectedFriend.friends.map(item => {
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

    if (!selectedFriend) return null

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
      <PageCover resource={getGroupCoverUrl('')} />
      <UserCoverBar
        friendsLenght={selectedFriend?.friends?.length || 0}
        className="desktop-only"
      />
      <Container>
        <PageColumnBarsWrapper>
          <LeftSideBar>
            <ProfileAvatar src={getAvatarUrl(userId as string)} />
            <ProfileName>{users[0]?.full_name}</ProfileName>
            <ProfileNote>@{users[0]?.name}</ProfileNote>
            <UserCoverBar
              friendsLenght={selectedFriend?.friends?.length || 0}
              className="mobile-only"
            />
          </LeftSideBar>
          <CentralBar>
            <PageBarTitle>
              {`${capitalizeFirstLetter(users[0]?.name)}\`s 
              friends (${selectedFriend?.friends?.length || 0})`}
            </PageBarTitle>
            {mapFriendsList()}
          </CentralBar>
          <RightSideBar>
            <PageBarTitle>Common friends ({commonFriends.length || 0})</PageBarTitle>
            {mapCommonFriendsList()}
          </RightSideBar>
        </PageColumnBarsWrapper>
      </Container>
    </>
  )
})

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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage)
